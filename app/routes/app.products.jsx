// // /* eslint-disable react/prop-types */


import { useEffect, useState } from "react";

// import { useLoaderData } from "react-router";

// export async function loader() {

  
// }

export default function Products() {
    const [products, setProducts] = useState([]);
 useEffect(() => {
    const fetchExportOrders = async () => {
        const res = await fetch(`/api/product/all`);
        const data = await res.json();
        console.log(data,"resreseresredsreresr")
        setProducts(Array.isArray(data) ? data : []);
    }
    fetchExportOrders()
},[])

  return (
    <section>
      <h1>All Products</h1>
      {products.map(p => (
        <div key={p.id}>
          {p.title} - {p.price} {p.currency}
        </div>
      ))}
    </section>
  );
}





// import { useEffect, useState } from "react";

// export default function AppOrderHistory() {
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchExportOrders = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/product/all");

//         if (!res.ok) {
//           throw new Error(`Error: ${res.status}`);
//         }

//         const data = await res.json();
//         console.log(data, "export orders data");

//         setProducts(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to fetch order history:", err);
//         setError("Failed to load order history.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExportOrders();
//   }, []);

//   // UI
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ marginBottom: "20px" }}>Product List</h2>

//       {/* Loading UI */}
//       {loading && <p>Loading products...</p>}

//       {/* Error UI */}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* No Products */}
//       {!loading && !error && products.length === 0 && (
//         <p>No products found.</p>
//       )}

//       {/* Products Grid */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//           gap: "20px",
//         }}
//       >
//         {products.map((p) => (
//           <div
//             key={p._id}
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: "10px",
//               padding: "15px",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             }}
//           >
//             {/* Product Image */}
//             {p.images?.length > 0 && (
//               <img
//                 src={p.images[0]}
//                 alt={p.title}
//                 style={{
//                   width: "100%",
//                   height: "200px",
//                   borderRadius: "8px",
//                   objectFit: "cover",
//                   marginBottom: "10px",
//                 }}
//               />
//             )}

//             {/* Title */}
//             <h3 style={{ margin: "5px 0" }}>{p.title}</h3>

//             {/* Price */}
//             <p><strong>Price:</strong> ₹{p.price}</p>

//             {/* Category */}
//             <p><strong>Category:</strong> {p.category}</p>

//             {/* SKU */}
//             <p><strong>SKU:</strong> {p.sku}</p>

//             {/* Stock */}
//             <p><strong>Stock:</strong> {p.stock}</p>

//             {/* Tags */}
//             {p.tags && (
//               <div style={{ marginTop: "10px" }}>
//                 <strong>Tags:</strong>
//                 <div style={{ marginTop: "5px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
//                   {p.tags.map((t) => (
//                     <span
//                       key={t}
//                       style={{
//                         background: "#efefef",
//                         padding: "5px 10px",
//                         borderRadius: "5px",
//                         fontSize: "12px",
//                       }}
//                     >
//                       {t}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
