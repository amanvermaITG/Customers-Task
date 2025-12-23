import { flatRoutes } from "@react-router/fs-routes";


// export default flatRoutes();

export default [
  ...(await flatRoutes()),
  {
    path: "/api/product/all",
    file: "./api/products.js",
  }
  // {
  //   path: "/api/webhook",
  //   file: "./api/webhook.js",
  // }

];