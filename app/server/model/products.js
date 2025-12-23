import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    variantId: { type: Number, required: true },
    price: String,
    sku: String,
    inventory: Number,
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: String,
    handle: String,
    vendor: String,
    status: String,

    variants: [VariantSchema],

    raw: Object,

    syncedAt: Date,
  },
  { timestamps: true }
);


export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
