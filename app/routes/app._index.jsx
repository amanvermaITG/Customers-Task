import { useEffect } from "react";
// import { useFetcher } from "react-router";
// import { useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "react-router";
import { useFetcher } from "react-router";
import {updateCustomerEmail  , resetCustomerEmail} from '../server/customer.server'



// export const action = async (props) => {
//   return updateCustomerEmail(props);
// };

export const action = async ({ request }) => {
  const form = await request.formData();
  const type = form.get("type");

  if (type === "reset") {
    return resetCustomerEmail({
      id: form.get("id"),
      restoredEmail: form.get("restoredEmail"),
      request,
    });
  }

  return updateCustomerEmail({
    id:form.get("id"),
    newEmail:form.get("email"),
    oldEmail:form.get("oldEmail"),
    request
  });
};


// ------------------ LOADER ------------------
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      customers(first: 50) {
        edges {
          node {
            id
            displayName
            email
            phone
            metafield(key: "restored_email", namespace: "custom") {
              value
            }
          }
        }
      }
    }
  `);

  const json = await response.json();
  const customers = json?.data?.customers?.edges?.map((e) => e.node) || [];

  return { customers };
};


// ------------------ COMPONENT ------------------
export default function Index() {
  const data = useLoaderData();
  const fetcher = useFetcher();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [email, setEmail] = useState("");

  // Search + Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setEmail(customer.email || "");
  };

  const emailValidation = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSave = () => {
    fetcher.submit(
      {
        id: selectedCustomer.id,
        email: email,
        oldEmail: selectedCustomer.email,
      },
      { method: "post" }
    );
  };

  useEffect(() => {
    if (fetcher.data?.success) {
      window.location.reload();
    }
  }, [fetcher.data]);

  // ---------------- FILTER CUSTOMERS ----------------
  const filterCustomers = () => {
    let customers = [...data.customers];

    // SEARCH
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.displayName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q)
      );
    }

    // SORTING
    if (sortType === "newest") {
      customers.sort((a, b) => (a.id < b.id ? 1 : -1));
    }
    if (sortType === "oldest") {
      customers.sort((a, b) => (a.id > b.id ? 1 : -1));
    }
    if (sortType === "title") {
      customers.sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );
    }

    return customers;
  };

  // Filtered list
  const filtered = filterCustomers();

  // Pagination math
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedCustomers = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // RESET EMAIL
  const resetEmail = (c) => {
    fetcher.submit(
      {
        id: c.id,
        type: "reset",
        restoredEmail: c.metafield?.value || "",
      },
      { method: "post" }
    );
  };

  return (
    <>
      <s-box padding="base">
        <s-heading
          heading="Cliento"
          padding="base"
          borderWidth="base"
          borderRadius="base"
          background="subdued"
        >
          Client Dashboard
        </s-heading>
      </s-box>

      <s-section padding="base">
        <s-section>
          <s-grid
            gridTemplateColumns="1fr auto"
            gap="small"
            justifyContent="center"
            alignItems="center"
          >
            <s-grid-item paddingBlock="small">
              <s-box>
                <s-search-field
                  placeholder="Search customers"
                  onInput={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </s-box>
            </s-grid-item>

            <s-grid-item>
              <s-box>
                <s-select
                  onChange={(e) => {
                    setSortType(e.target.value);
                    setPage(1);
                  }}
                >
                  <s-option value="">Sort By</s-option>
                  <s-option value="newest">Newest first</s-option>
                  <s-option value="oldest">Oldest first</s-option>
                  <s-option value="title">Name A–Z</s-option>
                </s-select>
              </s-box>
            </s-grid-item>
          </s-grid>

          <s-table
            paginate={true}
            hasPreviousPage={page > 1}
            hasNextPage={page < totalPages}
            onPreviousPage={() => setPage((p) => p - 1)}
            onNextPage={() => setPage((p) => p + 1)}
          >
            <s-table-header-row>
              <s-table-header>Name</s-table-header>
              <s-table-header>Email</s-table-header>
              <s-table-header>Phone</s-table-header>
              <s-table-header>Action</s-table-header>
            </s-table-header-row>

            <s-table-body>
              {paginatedCustomers.map((c) => (
                <s-table-row key={c.id}>
                  <s-table-cell>{c.displayName || "—"}</s-table-cell>
                  <s-table-cell>{c.email || "—"}</s-table-cell>
                  <s-table-cell>{c.phone || "—"}</s-table-cell>

                  <s-table-cell>
                     <s-button-group>
                   {c.metafield?.value ?
                    <s-button slot="secondary-actions" onClick={() => resetEmail(c)}>
                      <s-icon type="reset" />
                    </s-button>
                  :
                    <s-button commandFor="modal" slot="secondary-actions" onClick={() => openModal(c)}>
                      <s-icon type="edit" />
                    </s-button>
                     }
                    </s-button-group>
                  </s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>
        </s-section>
      </s-section>

      <s-modal id="modal" heading="Edit Customer Email">
        {selectedCustomer ? (
          <s-email-field
            label="Email"
            value={email}
            placeholder="Enter updated email"
            onInput={(e) => setEmail(e.target.value)}
          />
        ) : (
          <s-paragraph>No customer selected</s-paragraph>
        )}

        <s-button slot="secondary-actions" commandFor="modal">
          Close
        </s-button>

        <s-button
          slot="primary-action"
          variant="primary"
          commandFor="modal"
          disabled={!emailValidation(email)}
          onClick={handleSave}
        >
          Save
        </s-button>
      </s-modal>
    </>
  );
}

