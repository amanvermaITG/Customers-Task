
// import { json } from "@remix-run/node";
// import { authenticate } from "../shopify.server";

// export async function loader({ request }) {
//   const { admin } = await authenticate.admin(request);

//   const query = `
//     query getProducts {
//       products(first: 50) {
//         edges {
//           node {
//             id
//             title
//             priceRange {
//               minVariantPrice {
//                 amount
//                 currencyCode
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   const response = await admin.graphql(query);
//   const { data } = await response.json();

 
//   const products = data.products.edges.map((edge) => ({
//     id: edge.node.id,
//     title: edge.node.title,
//     price: edge.node.priceRange.minVariantPrice.amount,       
//     currency: edge.node.priceRange.minVariantPrice.currencyCode 
//   }));
//   console.log(products,"productsproductsproductsproducts");

//   return json({ products });
// }




import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  console.log("testetstetstsetsetset");
  const query = `
    query getProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const response = await admin.graphql(query);
  const { data } = await response.json();

  const products = data.products.edges.map(edge => ({
    id: edge.node.id,
    title: edge.node.title,
    price: edge.node.priceRange.minVariantPrice.amount,
    currency: edge.node.priceRange.minVariantPrice.currencyCode,
  }));

  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" },
  });
}
