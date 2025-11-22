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



  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setEmail(customer.email || "");
  };


  // ---------- EMAIL VALIDATION ----------
  const emailValidation = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };


  // ---------- SAVE CLICK ----------
  const handleSave = () => {
    console.log("Selected Customer:", selectedCustomer);
    console.log("Updated Email:", email);

  
     fetcher.submit(
      {
        id: selectedCustomer.id,
        email: email,
        oldEmail: selectedCustomer.email
      },
      { method: "post" }
    );
  };

  useEffect(() => {
  if (fetcher.data?.success) {
    window.location.reload();
  }
}, [fetcher.data]);

 const [page, setPage] = useState(1);
 const pageSize = 10;
 const totalPages = Math.ceil(data.customers.length / pageSize);

  // Slice paginated data
  const paginatedCustomers = data.customers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );


const resetEmail =(c)=>{
  console.log(c,"new Reset email")
   fetcher.submit(
    {
      id: c.id,
      type: "reset",
      restoredEmail: c.metafield?.value || "",
    },
    { method: "post" }
  );
}


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
        <s-section >
          <s-grid
            gridTemplateColumns="1fr auto"
            gap="small"
            justifyContent="center"
            alignItems="center"
          >
             <s-grid-item paddingBlock='small'>
                <s-box > 
                <s-search-field
                  label="Search"
                  labelAccessibilityVisibility="exclusive"
                  placeholder="Search customers"
                  className="new-search-custom"
                  
                />
                </s-box>
              </s-grid-item>
              <s-grid-item>
                <s-box > 
                <s-select label="" >
                   <s-option value="Sort" disb>Sort By</s-option>
                  <s-option value="newest">Newest first</s-option>
                  <s-option value="oldest">Oldest first</s-option>
                  <s-option value="title">Title A–Z</s-option>
                  <s-option value="price-low">Price: low to high</s-option>
                  <s-option value="price-high">Price: high to low</s-option>
                </s-select>
                </s-box> 
              </s-grid-item>
          </s-grid>

          <s-table>
            <s-table-header-row>
              <s-table-header>Name</s-table-header>
              <s-table-header>Email</s-table-header>
              <s-table-header>Phone</s-table-header>
              <s-table-header>Action</s-table-header>
            </s-table-header-row>

            <s-table-body>
              {paginatedCustomers?.map((c) => (
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
          <s-box padding="base" alignment="center">
            <s-button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}

            >
              Previous
            </s-button>

            <span>Page {page} of {totalPages}</span>

            <s-button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
             
            >
              Next
            </s-button>
          </s-box>

        </s-section>
      </s-section>


      <s-modal id="modal" heading="Edit Customer Email" >
        {selectedCustomer ? (
          <s-box>
            <s-email-field
              label="Email"
              placeholder="Enter updated email"
              details={`Editing: ${selectedCustomer.displayName}`}
              value={email}
              onInput={(e) => setEmail(e.target.value)}
            />
          </s-box>
        ) : (
          <s-paragraph>No customer selected</s-paragraph>
        )}

        <s-button
          slot="secondary-actions"
          commandFor="modal"
          command="--hide"
        >
          Close
        </s-button>

        <s-button
          slot="primary-action"
          variant="primary"
          commandFor="modal"
          command="--hide"
          disabled={!emailValidation(email)}
          onClick={handleSave}
        >
          Save
        </s-button>
      </s-modal>
    </>
  );
}
