 import { saveOrUpdateProduct } from "../server/model/product.server";

import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);
 
  console.log(`:::---Received ${topic} webhook for ${shop}---:::`);

  switch (topic) {
    case "PRODUCTS_UPDATE":
 console.log(payload,"payloadpayloadpayloadpayloadpayload")
 await saveOrUpdateProduct(payload)
      console.log("executing ::: PRODUCTS_UPDATE webhook");
      
      break;

    case "ORDERS_UPDATED":
      console.log(payload,"executing ::: ORDERS_CREATE webhook");
    
      break;

    case "ORDERS_CANCELLED": {
    console.log(payload,"executing ::: ORDERS_CANCELLED webhook");
  
      break;
    }

    default:
      console.log("--topic--", topic);
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
