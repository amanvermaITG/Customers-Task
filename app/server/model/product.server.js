import { dbConnection } from "../../db.server";
import Product from "../model/products";

export async function saveOrUpdateProduct(product) {
  console.log(product, "------------------------product-------------");

  await dbConnection(); // 🔥 important

  const data = {
    productId: product.id,
    title: product.title,
    handle: product.handle,
    vendor: product.vendor,
    status: product.status,
    variants: product.variants?.map(v => ({
      variantId: v.id,
      price: v.price,
      sku: v.sku,
      inventory: v.inventory_quantity,
    })) || [],
    raw: product,
    syncedAt: new Date(),
  };

  await Product.findOneAndUpdate(
    { productId: product.id }, // condition
    data,                      // data
    { upsert: true, new: true } // 🔥 create if not exists
  );

  console.log("✅ Product saved via Mongoose");
}
