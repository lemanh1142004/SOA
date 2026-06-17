// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { getAssociationRules } from "../api/aiApi";
// // import "../App.css";

// // const AssociationRulesPage = () => {
// //   const [rules, setRules] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();

// //   /// 1. KIỂM TRA QUYỀN ADMIN (Bảo mật Route)
// //   useEffect(() => {
// //     // Bước 1: Lấy cái hộp "user" ra
// //     const userString = localStorage.getItem("user");

// //     let userRole = null;

// //     // Bước 2: Mở hộp (parse JSON) để lấy role bên trong
// //     if (userString) {
// //       try {
// //         const currentUser = JSON.parse(userString);
// //         userRole = currentUser.role; // Lấy đúng chữ "ADMIN" từ object
// //       } catch (error) {
// //         console.error("Lỗi đọc dữ liệu user:", error);
// //       }
// //     }

// //     // Bước 3: Kiểm tra quyền
// //     if (userRole !== "ADMIN") {
// //       navigate("/cars");
// //     }
// //   }, [navigate]);

// //   useEffect(() => {
// //     const fetchRules = async () => {
// //       try {
// //         const data = await getAssociationRules();
// //         // Lấy các luật hợp lệ và sắp xếp theo độ tin cậy (Confidence) giảm dần
// //         const validRules = (data.rules || []).sort(
// //           (a, b) => b.confidence - a.confidence,
// //         );
// //         setRules(validRules);
// //         setLoading(false);
// //       } catch (err) {
// //         setError(
// //           "Không thể kết nối đến AI Service. Vui lòng kiểm tra lại Backend.",
// //         );
// //         setLoading(false);
// //       }
// //     };

// //     fetchRules();
// //   }, []);

// //   // 2. PHIÊN DỊCH DỮ LIỆU SANG TIẾNG VIỆT CHUẨN UX
// //   const formatItem = (item) => {
// //     if (!item) return "";
// //     const lowerItem = item.toLowerCase();

// //     // Dáng xe & Hãng
// //     if (lowerItem.startsWith("brand_"))
// //       return `Hãng ${item.split("_")[1].toUpperCase()}`;
// //     if (lowerItem.startsWith("style_"))
// //       return `Dáng ${item.split("_")[1].toUpperCase()}`;
// //     if (lowerItem.startsWith("fuel_")) return `Máy ${item.split("_")[1]}`;
// //     if (lowerItem.startsWith("trans_")) return `Số ${item.split("_")[1]}`;

// //     // Rổ Ngân sách
// //     if (lowerItem.startsWith("price_")) {
// //       const p = lowerItem.replace("price_", "");
// //       if (p === "<400tr") return "Dưới 400 triệu";
// //       if (p === "400-700tr") return "Từ 400 - 700 triệu";
// //       if (p === "700-1ty") return "Từ 700 Triệu - 1 Tỷ";
// //       if (p === ">1ty") return "Trên 1 Tỷ";
// //     }

// //     // Rổ Số KM (Odo)
// //     if (lowerItem.startsWith("km_")) {
// //       const k = lowerItem.replace("km_", "");
// //       if (k === "luot") return "Xe lướt (Dưới 2 vạn)";
// //       if (k === "trungbinh") return "Đi vừa (2-6 vạn)";
// //       if (k === "cao") return "Đi nhiều (6-10 vạn)";
// //       if (k === "ratcao") return "Đi rất nhiều (>10 vạn)";
// //     }

// //     return item;
// //   };

// //   if (loading)
// //     return (
// //       <div
// //         className="car-page"
// //         style={{
// //           display: "flex",
// //           justifyContent: "center",
// //           marginTop: "100px",
// //         }}
// //       >
// //         <div className="loading-state">
// //           <span style={{ fontSize: "24px" }}>⏳</span>
// //           <h3>AI đang quét dữ liệu thị trường...</h3>
// //           <p className="muted">Quá trình này có thể mất vài giây.</p>
// //         </div>
// //       </div>
// //     );

// //   if (error)
// //     return (
// //       <div className="car-page">
// //         <div className="error-state">❌ {error}</div>
// //       </div>
// //     );

// //   return (
// //     <div
// //       className="car-page page-transition"
// //       style={{ maxWidth: "1200px", margin: "0 auto" }}
// //     >
// //       {/* HEADER DASHBOARD */}
// //       <div
// //         className="page-header"
// //         style={{
// //           borderBottom: "2px solid #eee",
// //           paddingBottom: "20px",
// //           marginBottom: "30px",
// //         }}
// //       >
// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //           }}
// //         >
// //           <div>
// //             <span
// //               className="badge"
// //               style={{
// //                 backgroundColor: "#ef4444",
// //                 color: "white",
// //                 marginBottom: "10px",
// //               }}
// //             >
// //               Admin Dashboard
// //             </span>
// //             <h1 style={{ margin: "5px 0" }}>Báo cáo Xu hướng Khách hàng</h1>
// //             <p className="muted">
// //               Phân tích hành vi mua sắm dựa trên thuật toán Apriori
// //             </p>
// //           </div>
// //           <div style={{ textAlign: "right" }}>
// //             <h2
// //               style={{ color: "var(--primary)", margin: 0, fontSize: "32px" }}
// //             >
// //               {rules.length}
// //             </h2>
// //             <span className="muted">Luật được tìm thấy</span>
// //           </div>
// //         </div>
// //       </div>

// //       {rules.length === 0 ? (
// //         <div className="empty-state">
// //           Kho dữ liệu chưa đủ dày để AI có thể kết luận thành các quy luật chắc
// //           chắn (Cần thêm xe cùng chủng loại).
// //         </div>
// //       ) : (
// //         <div className="rules-dashboard">
// //           {/* GIẢI THÍCH CHỈ SỐ CHO ADMIN */}
// //           <div
// //             className="info-box"
// //             style={{
// //               backgroundColor: "#f8fafc",
// //               padding: "15px",
// //               borderRadius: "8px",
// //               marginBottom: "25px",
// //               fontSize: "14px",
// //             }}
// //           >
// //             <ul
// //               style={{
// //                 margin: "10px 0 0 0",
// //                 paddingLeft: "20px",
// //                 color: "#475569",
// //               }}
// //             >
// //               <li>
// //                 <b>Support (Độ phổ biến):</b> Tỷ lệ phần trăm khách hàng có nhóm
// //                 nhu cầu này trên tổng số toàn bộ thị trường.
// //               </li>
// //               <li>
// //                 <b>Confidence (Tỷ lệ chốt):</b> Khả năng khách hàng sẽ mua/chọn
// //                 nhóm <i>Vế Phải</i> khi họ đã tìm kiếm nhóm <i>Vế Trái</i>.
// //               </li>
// //             </ul>
// //           </div>

// //           {/* BẢNG DỮ LIỆU CAO CẤP */}
// //           <div
// //             className="rules-table-container"
// //             style={{
// //               background: "#fff",
// //               borderRadius: "12px",
// //               boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
// //               overflow: "hidden",
// //             }}
// //           >
// //             <table
// //               className="rules-table"
// //               style={{
// //                 width: "100%",
// //                 borderCollapse: "collapse",
// //                 textAlign: "left",
// //               }}
// //             >
// //               <thead
// //                 style={{
// //                   backgroundColor: "#f1f5f9",
// //                   borderBottom: "2px solid #cbd5e1",
// //                 }}
// //               >
// //                 <tr>
// //                   <th style={{ padding: "16px" }}>
// //                     Nhu cầu đầu vào (Nếu khách tìm...)
// //                   </th>
// //                   <th
// //                     style={{
// //                       padding: "16px",
// //                       width: "50px",
// //                       textAlign: "center",
// //                     }}
// //                   ></th>
// //                   <th style={{ padding: "16px" }}>
// //                     Quyết định cuối (...Thì họ sẽ chọn)
// //                   </th>
// //                   <th style={{ padding: "16px", width: "120px" }}>
// //                     Độ phổ biến
// //                   </th>
// //                   <th style={{ padding: "16px", width: "150px" }}>
// //                     Tỷ lệ chốt
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rules.map((rule, index) => (
// //                   <tr
// //                     key={index}
// //                     style={{
// //                       borderBottom: "1px solid #e2e8f0",
// //                       transition: "background 0.2s",
// //                     }}
// //                   >
// //                     {/* VẾ TRÁI (Antecedents) */}
// //                     <td style={{ padding: "16px" }}>
// //                       <div
// //                         style={{
// //                           display: "flex",
// //                           gap: "6px",
// //                           flexWrap: "wrap",
// //                         }}
// //                       >
// //                         {rule.antecedents.map((item, i) => (
// //                           <span
// //                             key={i}
// //                             className="tag"
// //                             style={{
// //                               backgroundColor: "#e0f2fe",
// //                               color: "#0369a1",
// //                               padding: "4px 10px",
// //                               borderRadius: "20px",
// //                               fontSize: "13px",
// //                               fontWeight: "500",
// //                             }}
// //                           >
// //                             {formatItem(item)}
// //                           </span>
// //                         ))}
// //                       </div>
// //                     </td>

// //                     {/* MŨI TÊN */}
// //                     <td
// //                       style={{
// //                         padding: "16px",
// //                         textAlign: "center",
// //                         color: "#94a3b8",
// //                       }}
// //                     >
// //                       <svg
// //                         width="20"
// //                         height="20"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         viewBox="0 0 24 24"
// //                       >
// //                         <path
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                           d="M14 5l7 7m0 0l-7 7m7-7H3"
// //                         ></path>
// //                       </svg>
// //                     </td>

// //                     {/* VẾ PHẢI (Consequents) */}
// //                     <td style={{ padding: "16px" }}>
// //                       <div
// //                         style={{
// //                           display: "flex",
// //                           gap: "6px",
// //                           flexWrap: "wrap",
// //                         }}
// //                       >
// //                         {rule.consequents.map((item, i) => (
// //                           <span
// //                             key={i}
// //                             className="tag"
// //                             style={{
// //                               backgroundColor: "#dcfce3",
// //                               color: "#15803d",
// //                               padding: "4px 10px",
// //                               borderRadius: "20px",
// //                               fontSize: "13px",
// //                               fontWeight: "bold",
// //                             }}
// //                           >
// //                             {formatItem(item)}
// //                           </span>
// //                         ))}
// //                       </div>
// //                     </td>

// //                     {/* ĐỘ PHỔ BIẾN (Support) */}
// //                     <td
// //                       style={{
// //                         padding: "16px",
// //                         color: "#64748b",
// //                         fontWeight: "500",
// //                       }}
// //                     >
// //                       {(rule.support * 100).toFixed(1)}%
// //                     </td>

// //                     {/* TỶ LỆ CHỐT (Confidence) CÓ THANH PROGRESS BAR */}
// //                     <td style={{ padding: "16px" }}>
// //                       <div
// //                         style={{
// //                           display: "flex",
// //                           alignItems: "center",
// //                           gap: "8px",
// //                         }}
// //                       >
// //                         <span
// //                           style={{
// //                             fontWeight: "bold",
// //                             color:
// //                               rule.confidence >= 0.7 ? "#15803d" : "#ca8a04",
// //                             minWidth: "40px",
// //                           }}
// //                         >
// //                           {(rule.confidence * 100).toFixed(0)}%
// //                         </span>
// //                         <div
// //                           style={{
// //                             flex: 1,
// //                             height: "6px",
// //                             backgroundColor: "#e2e8f0",
// //                             borderRadius: "3px",
// //                             overflow: "hidden",
// //                           }}
// //                         >
// //                           <div
// //                             style={{
// //                               height: "100%",
// //                               width: `${rule.confidence * 100}%`,
// //                               backgroundColor:
// //                                 rule.confidence >= 0.7 ? "#22c55e" : "#eab308",
// //                             }}
// //                           ></div>
// //                         </div>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AssociationRulesPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAssociationRules } from "../api/aiApi";

// const AssociationRulesPage = () => {
//   const [rules, setRules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Có thể bỏ qua check quyền Admin nếu muốn page này public cho người mua đọc Report
//     const fetchRules = async () => {
//       try {
//         const data = await getAssociationRules();
//         setRules(data.rules || []);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRules();
//   }, []);

//   const formatTrait = (trait) => {
//     const val = trait.split("_")[1];
//     if (trait.startsWith("brand_"))
//       return (
//         <span
//           className="hero-badge"
//           style={{
//             background: "#f0f9ff",
//             color: "#0369a1",
//             margin: "2px",
//             padding: "4px 8px",
//           }}
//         >
//           Hãng {val.toUpperCase()}
//         </span>
//       );
//     if (trait.startsWith("style_"))
//       return (
//         <span
//           className="hero-badge"
//           style={{
//             background: "#f1f5f9",
//             color: "#334155",
//             margin: "2px",
//             padding: "4px 8px",
//           }}
//         >
//           Dáng {val.toUpperCase()}
//         </span>
//       );
//     if (trait.startsWith("fuel_"))
//       return (
//         <span
//           className="hero-badge"
//           style={{
//             background: "#fef2f2",
//             color: "#b91c1c",
//             margin: "2px",
//             padding: "4px 8px",
//           }}
//         >
//           Máy {val.toLowerCase()}
//         </span>
//       );
//     if (trait.startsWith("trans_"))
//       return (
//         <span
//           className="hero-badge"
//           style={{
//             background: "#fdf4ff",
//             color: "#a21caf",
//             margin: "2px",
//             padding: "4px 8px",
//           }}
//         >
//           Số {val.toLowerCase()}
//         </span>
//       );
//     if (trait.startsWith("price_"))
//       return (
//         <span
//           className="hero-badge"
//           style={{
//             background: "#ecfdf5",
//             color: "#15803d",
//             margin: "2px",
//             padding: "4px 8px",
//           }}
//         >
//           Tầm giá {val}
//         </span>
//       );
//     if (trait.startsWith("km_"))
//       return (
//         <span
//           className="hero-badge"
//           style={{
//             background: "#fffbeb",
//             color: "#b45309",
//             margin: "2px",
//             padding: "4px 8px",
//           }}
//         >
//           số km đã đi: {val}
//         </span>
//       );
//     return val;
//   };

//   return (
//     <div className="page-transition">
//       <div className="container">
//         <div
//           className="page-header section-padding"
//           style={{ textAlign: "center", paddingBottom: "30px" }}
//         >
//           <div className="hero-badge" style={{ margin: "0 auto 15px" }}>
//             <span className="pulse-dot"></span> Báo Cáo Thị Trường
//           </div>
//           <h1 className="hero-title">
//             Xu Hướng <span>& Thị Hiếu</span>
//           </h1>
//           <p className="hero-desc" style={{ margin: "10px auto" }}>
//             Dựa trên lịch sử tìm kiếm và giao dịch, hệ thống đã trích xuất các
//             "cấu hình quốc dân" mà khách hàng chuộng nhất.
//           </p>
//         </div>

//         {loading ? (
//           <div className="loading-state">Đang xuất báo cáo xu hướng...</div>
//         ) : (
//           <div
//             className="rules-table-container"
//             style={{
//               boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)",
//               borderRadius: "24px",
//               overflow: "hidden",
//               border: "1px solid #e2e8f0",
//               marginBottom: "80px",
//             }}
//           >
//             <table
//               className="rules-table"
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 textAlign: "left",
//                 background: "#fff",
//               }}
//             >
//               <thead>
//                 <tr
//                   style={{
//                     background: "#f8fafc",
//                     color: "#64748b",
//                     fontSize: "13px",
//                     textTransform: "uppercase",
//                     letterSpacing: "1px",
//                   }}
//                 >
//                   <th
//                     style={{
//                       padding: "20px",
//                       borderBottom: "2px solid #e2e8f0",
//                     }}
//                   >
//                     Nếu khách hàng quan tâm...
//                   </th>
//                   <th
//                     style={{
//                       padding: "20px",
//                       borderBottom: "2px solid #e2e8f0",
//                     }}
//                   >
//                     Thường sẽ chốt chung với...
//                   </th>
//                   <th
//                     style={{
//                       padding: "20px",
//                       borderBottom: "2px solid #e2e8f0",
//                       width: "200px",
//                     }}
//                   >
//                     Độ phổ biến (Tỷ lệ chốt)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rules.map((rule, idx) => (
//                   <tr
//                     key={idx}
//                     style={{
//                       borderBottom: "1px solid #f1f5f9",
//                       transition: "background 0.2s",
//                     }}
//                     onMouseOver={(e) =>
//                       (e.currentTarget.style.background = "#f8fafc")
//                     }
//                     onMouseOut={(e) =>
//                       (e.currentTarget.style.background = "#fff")
//                     }
//                   >
//                     <td style={{ padding: "20px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: "4px",
//                         }}
//                       >
//                         {rule.antecedents.map((a, i) => (
//                           <React.Fragment key={i}>
//                             {formatTrait(a)}
//                           </React.Fragment>
//                         ))}
//                       </div>
//                     </td>
//                     <td style={{ padding: "20px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: "4px",
//                         }}
//                       >
//                         {rule.consequents.map((c, i) => (
//                           <React.Fragment key={i}>
//                             {formatTrait(c)}
//                           </React.Fragment>
//                         ))}
//                       </div>
//                     </td>
//                     <td style={{ padding: "20px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "10px",
//                         }}
//                       >
//                         <span
//                           style={{
//                             fontWeight: 800,
//                             fontSize: "16px",
//                             color:
//                               rule.confidence >= 0.7 ? "#10b981" : "#f59e0b",
//                           }}
//                         >
//                           {(rule.confidence * 100).toFixed(0)}%
//                         </span>
//                         <div
//                           style={{
//                             flex: 1,
//                             height: "8px",
//                             background: "#e2e8f0",
//                             borderRadius: "4px",
//                             overflow: "hidden",
//                           }}
//                         >
//                           <div
//                             style={{
//                               height: "100%",
//                               width: `${rule.confidence * 100}%`,
//                               background:
//                                 rule.confidence >= 0.7
//                                   ? "linear-gradient(90deg, #10b981, #34d399)"
//                                   : "linear-gradient(90deg, #f59e0b, #fbbf24)",
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default AssociationRulesPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAssociationRules } from "../api/aiApi";
import "../App.css";
import "../admin-styles.css";

const AssociationRulesPage = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role !== "ADMIN") navigate("/cars");

    const fetchRules = async () => {
      try {
        const data = await getAssociationRules();
        setRules(data.rules || []);
      } catch (err) {
        setError("Lỗi khi tải luật kết hợp.");
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, [navigate]);

  // HÀM DỊCH NHÃN (Format dữ liệu)
  const formatLabel = (str) => {
    if (!str) return str;
    const parts = str.split("_");
    const prefix = parts[0];
    const value = parts.slice(1).join(" ");

    const mapping = {
      style: "Loại xe",
      origin: "Xuất xứ",
      status: "Tình trạng",
      brand: "Hãng xe",
      price: "Giá",
      transmission: "Hộp số",
      fuel: "Nhiên liệu",
      color: "Màu",
    };

    return mapping[prefix] ? `${mapping[prefix]}: ${value}` : str;
  };

  const totalPages = Math.max(1, Math.ceil(rules.length / ITEMS_PER_PAGE));
  const currentRules = rules.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            Báo cáo xu hướng thị trường
          </h1>
          <p style={{ color: "#64748b" }}>
            Phân tích quy luật kết hợp từ dữ liệu khách hàng
          </p>
        </div>
      </div>

      <div className="admin-card">
        {loading && <p>Đang xử lý dữ liệu AI...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {!loading && !error && rules.length > 0 && (
          <div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f1f5f9",
                    color: "#334155",
                    textAlign: "left",
                  }}
                >
                  <th
                    style={{
                      padding: "16px",
                      borderRadius: "8px 0 0 8px",
                      background: "#e0fefb",
                    }}
                  >
                    STT
                  </th>
                  <th style={{ padding: "16px", background: "#e0fefb" }}>
                    Điều kiện tìm kiếm
                  </th>
                  <th style={{ padding: "16px", background: "#e0fefb" }}>
                    Kết quả gợi ý
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      borderRadius: "0 8px 8px 0",
                      background: "#e0fefb",
                    }}
                  >
                    Độ tin cậy
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRules.map((rule, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      background: "#ffffff",
                    }}
                  >
                    <td
                      style={{
                        padding: "20px",
                        fontSize: "15px",
                        fontWeight: "600",
                      }}
                    >
                      {page * ITEMS_PER_PAGE + index + 1}
                    </td>

                    <td style={{ padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {(rule.antecedents || []).map((item, i) => (
                          <span
                            key={i}
                            style={{
                              background: "#e0f2fe",
                              color: "#0369a1",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            {formatLabel(item)}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {(rule.consequents || []).map((item, i) => (
                          <span
                            key={i}
                            style={{
                              background: "#fef3c7",
                              color: "#92400e",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            {formatLabel(item)}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "700",
                            color:
                              rule.confidence > 0.6 ? "#059669" : "#d97706",
                            fontSize: "15px",
                          }}
                        >
                          {(rule.confidence * 100).toFixed(0)}%
                        </span>
                        <div
                          style={{
                            width: "100px",
                            height: "8px",
                            background: "#e2e8f0",
                            borderRadius: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: `${rule.confidence * 100}%`,
                              height: "100%",
                              background:
                                rule.confidence > 0.6 ? "#059669" : "#d97706",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* THANH ĐIỀU HƯỚNG PHÂN TRANG MỚI */}
            <div className="pagination-container">
              <span style={{ color: "#64748b" }}>
                Trang {page + 1} / {totalPages}
              </span>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                >
                  Trước
                </button>
                <select
                  className="pagination-select"
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                >
                  {[...Array(totalPages)].map((_, i) => (
                    <option key={i} value={i}>
                      Trang {i + 1}
                    </option>
                  ))}
                </select>
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssociationRulesPage;
