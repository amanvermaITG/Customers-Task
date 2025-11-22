
import { authenticate } from "../shopify.server";


export async function updateCustomerEmail({id,newEmail,oldEmail,request }) {
  console.log(request,"requestrequestrequest")
  const { admin } = await authenticate.admin(request);
  // const form = await request.formData();
  
  // const id = form.get("id");
  // const newEmail = form.get("email");
  // const oldEmail = form.get("oldEmail");

  const updateResponse = await admin.graphql(
    `
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          email
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
    {
      variables: {
        input: {
          id,
          email: newEmail,
        },
      },
    },
  );

  const updateJson = await updateResponse.json();
  console.log('new upated----------',updateJson);
  if (updateJson?.data?.customerUpdate?.userErrors?.length) {
    return { error: updateJson.data.customerUpdate.userErrors[0].message };
  }

  const metafieldResponse = await admin.graphql(
    `
    mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          key
          namespace
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
    {
      variables: {
        metafields: [
          {
            key: "restored_email",
            namespace: "custom",
            ownerId: id,
            type: "single_line_text_field",
            value: oldEmail || "",
          },
        ],
      },
    },
  );

  const metafieldJson = await metafieldResponse.json();
  if (metafieldJson?.data?.metafieldsSet?.userErrors?.length) {
    return { error: metafieldJson.data.metafieldsSet.userErrors[0].message };
  }

  return { success: true };
}




export async function resetCustomerEmail({ id, restoredEmail, request }) {
  const { admin } = await authenticate.admin(request);

  try {
    // 1. Restore original email
    const restoreRes = await admin.graphql(
      `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            email
          }
          userErrors {
            field
            message
          }
        }
      }
      `,
      {
        variables: {
          input: {
            id,
            email: restoredEmail
          }
        }
      }
    );

    const restoreJson = await restoreRes.json();
    console.log("Email restored:", restoreJson);


    // 2. Clear metafield properly
const clearMetaRes = await admin.graphql(
  `
  mutation DeleteSpecificMetafield($ownerId: ID!) {
    metafieldsDelete(
      metafields: [
        {
          ownerId: $ownerId
          namespace: "custom"
          key: "restored_email"
        }
      ]
    ) {
      deletedMetafields {
        key
        namespace
        ownerId
      }
      userErrors {
        field
        message
      }
    }
  }
  `,
  {
    variables: {
      ownerId: id,
    },
  }
);

const clearMetaJson = await clearMetaRes.json();
console.log("Metafield cleared:", clearMetaJson);


    return { success: true };
  } catch (err) {
    console.error("Reset Error:", err);
    return { success: false, error: err.message };
  }
}
