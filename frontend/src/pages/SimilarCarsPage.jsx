// Trang gợi ý xe tương tự dựa trên ID xe hiện tại, sử dụng API từ Backend để lấy dữ liệu
import { useState } from "react";
import axios from "axios";

const IMAGE_FALLBACK = "/no-image.svg";

function parsePrice(value) {
  if (value === null || value === undefined) return null;

  // 🔥 DÒNG FIX LỖI: Nếu value đã là số nguyên/số thập phân chuẩn từ Backend -> Trả về luôn!
  if (typeof value === "number") return value;

  const text = String(value).trim().toLowerCase();
  if (!text) return null;

  const hasUnit = /(ty|tỷ|ti|tỉ|trieu|triệu|nghin|nghìn|ngan|ngàn)/.test(text);
  const match = text.replace(/,/g, ".").match(/\d+(?:\.\d+)?/);

  if (!match) return null;
  let number = parseFloat(match[0]);

  if (hasUnit) {
    if (
      text.includes("ty") ||
      text.includes("tỷ") ||
      text.includes("ti") ||
      text.includes("tỉ")
    )
      number *= 1_000_000_000;
    else if (text.includes("trieu") || text.includes("triệu"))
      number *= 1_000_000;
    else if (
      text.includes("nghin") ||
      text.includes("nghìn") ||
      text.includes("ngan") ||
      text.includes("ngàn")
    )
      number *= 1_000;
    return number;
  }

  return number;
}

function formatPrice(value) {
  let numeric = parsePrice(value);

  if (!numeric || Number.isNaN(numeric))
    return value ? String(value) : "Chưa có giá";

  if (numeric > 100_000_000_000) {
    const numString = String(numeric);
    numeric = Number(numString.substring(0, 10));
  }

  if (numeric >= 1_000_000_000) {
    return (numeric / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + " Tỷ";
  } else if (numeric >= 1_000_000) {
    return Math.round(numeric / 1_000_000) + " Triệu";
  }

  return new Intl.NumberFormat("vi-VN").format(numeric) + " VNĐ";
}

function SimilarCarsPage() {
  const [carId, setCarId] = useState("");
  const [result, setResult] = useState(null);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://gateway-api-ngbw.onrender.com/api/ai/recommendations/similar/${carId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setResult(res.data);
    } catch (error) {
      console.error("Lỗi gợi ý xe:", error);
      alert("Không tìm thấy xe hoặc chưa có dữ liệu");
    }
  };

  return (
    <div className="car-page">
      <div className="page-header">
        <h1>Gợi ý xe tương tự</h1>
        <p>Nhập ID xe để hệ thống đề xuất danh sách xe gần giống.</p>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <input
            className="search-input"
            type="number"
            placeholder="Nhập ID xe"
            value={carId}
            onChange={(event) => setCarId(event.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchRecommendations}>
            Tìm xe tương tự
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="related-section">
            <div className="section-head">
              <div>
                <h2>Xe đang xem</h2>
                <p className="muted">
                  Thông tin xe trung tâm để tính toán tương đồng.
                </p>
              </div>
            </div>
            <div className="car-grid">
              <div className="car-card">
                <div className="car-image-wrap">
                  <img
                    src={result.currentCar?.urlHinhAnh || IMAGE_FALLBACK}
                    alt={result.currentCar?.tieuDe || "Xe ô tô"}
                    className="car-image"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = IMAGE_FALLBACK;
                    }}
                  />
                </div>
                <div className="car-card-body">
                  <div className="car-title-row">
                    <h3>{result.currentCar?.tieuDe || "Không có tiêu đề"}</h3>
                    <span className="car-year">#{result.currentCar?.id}</span>
                  </div>
                  <p className="car-price">
                    {formatPrice(result.currentCar?.gia)}
                  </p>
                  <div className="tag-row">
                    <span className="tag">
                      Segment {result.currentCar?.segmentId ?? "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="related-section">
            <div className="section-head">
              <div>
                <h2>Xe cùng phân khúc</h2>
                <p className="muted">
                  Gợi ý từ những xe có dữ liệu tương đồng.
                </p>
              </div>
            </div>
            {result.recommendedCars?.length ? (
              <div className="car-grid">
                {result.recommendedCars.map((car) => (
                  <div key={car.id} className="car-card">
                    <div className="car-image-wrap">
                      <img
                        src={car.urlHinhAnh || IMAGE_FALLBACK}
                        alt={car.tieuDe || "Xe ô tô"}
                        className="car-image"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = IMAGE_FALLBACK;
                        }}
                      />
                    </div>
                    <div className="car-card-body">
                      <div className="car-title-row">
                        <h3>{car.tieuDe || "Không có tiêu đề"}</h3>
                        <span className="car-year">#{car.id}</span>
                      </div>
                      <p className="car-price">{formatPrice(car.gia)}</p>
                      <div className="car-meta-grid">
                        <div>
                          <span>Số km</span>
                          <strong>{car.soKmDaDi || "N/A"}</strong>
                        </div>
                        <div>
                          <span>Nhiên liệu</span>
                          <strong>{car.nhienLieu || "N/A"}</strong>
                        </div>
                        <div>
                          <span>Hộp số</span>
                          <strong>{car.hopSo || "N/A"}</strong>
                        </div>
                        <div>
                          <span>Segment</span>
                          <strong>{car.segmentId ?? "-"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Chưa có xe gợi ý phù hợp.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SimilarCarsPage;

// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const IMAGE_FALLBACK = "/no-image.svg";

// function parsePrice(value) {
//   if (value == null) return null;
//   if (typeof value === "number") return value;
//   const text = String(value).trim().toLowerCase();
//   if (!text) return null;
//   const hasUnit = /(ty|tỷ|ti|tỉ|trieu|triệu|nghin|nghìn|ngan|ngàn)/.test(text);
//   const match = text.replace(/,/g, ".").match(/\d+(?:\.\d+)?/);
//   if (!match) return null;
//   let number = parseFloat(match[0]);
//   if (hasUnit) {
//     if (
//       text.includes("ty") ||
//       text.includes("tỷ") ||
//       text.includes("ti") ||
//       text.includes("tỉ")
//     )
//       number *= 1_000_000_000;
//     else if (text.includes("trieu") || text.includes("triệu"))
//       number *= 1_000_000;
//     else if (
//       text.includes("nghin") ||
//       text.includes("nghìn") ||
//       text.includes("ngan") ||
//       text.includes("ngàn")
//     )
//       number *= 1_000;
//     return number;
//   }
//   return Number(text.replace(/[^\d]/g, "")) || number;
// }
// function formatPrice(value) {
//   let numeric = parsePrice(value);
//   if (!numeric || Number.isNaN(numeric))
//     return value ? String(value) : "Liên hệ";
//   if (numeric > 100_000_000_000)
//     numeric = Number(String(numeric).substring(0, 10));
//   if (numeric >= 1_000_000_000)
//     return (numeric / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + " Tỷ";
//   else if (numeric >= 1_000_000)
//     return Math.round(numeric / 1_000_000) + " Triệu";
//   return new Intl.NumberFormat("vi-VN").format(numeric) + " VNĐ";
// }

// function SimilarCarsPage() {
//   const [carId, setCarId] = useState("");
//   const [result, setResult] = useState(null);
//   const navigate = useNavigate();

//   const fetchRecommendations = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `http://localhost:8080/api/ai/recommendations/similar/${carId}`,
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       setResult(res.data);
//     } catch (e) {
//       alert("Không tìm thấy mã xe này trong hệ thống!");
//     }
//   };

//   return (
//     <div className="page-transition">
//       <div className="container">
//         <div
//           className="page-header section-padding"
//           style={{ textAlign: "center", paddingBottom: "30px" }}
//         >
//           <div className="hero-badge" style={{ margin: "0 auto 15px" }}>
//             <span className="pulse-dot"></span> Công Cụ Gợi Ý
//           </div>
//           <h1 className="hero-title">
//             Đề Xuất <span>Xe Tương Tự</span>
//           </h1>
//           <p className="hero-desc" style={{ margin: "10px auto" }}>
//             Nhập mã xe (ID) bạn đang quan tâm, hệ thống sẽ đề xuất các xe cùng
//             tầm giá và thông số.
//           </p>
//         </div>

//         <div
//           style={{
//             maxWidth: "500px",
//             margin: "0 auto 50px",
//             display: "flex",
//             gap: "15px",
//           }}
//         >
//           <input
//             className="filter-control"
//             type="number"
//             placeholder="Nhập mã xe (VD: 1245)"
//             value={carId}
//             onChange={(e) => setCarId(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && fetchRecommendations()}
//           />
//           <button
//             className="hero-btn-primary"
//             style={{ whiteSpace: "nowrap" }}
//             onClick={fetchRecommendations}
//           >
//             Tìm Gợi Ý
//           </button>
//         </div>

//         {result && (
//           <div className="features-section" style={{ paddingTop: 0 }}>
//             <div
//               className="modern-feature-grid"
//               style={{ gridTemplateColumns: "1fr 2fr" }}
//             >
//               {/* Xe gốc */}
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   padding: "24px",
//                   borderRadius: "24px",
//                   border: "1px solid #e2e8f0",
//                 }}
//               >
//                 <h3
//                   style={{
//                     fontSize: "18px",
//                     color: "#64748b",
//                     marginBottom: "20px",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Xe Đang Tham Khảo
//                 </h3>
//                 <div
//                   className="car-card"
//                   onClick={() => navigate(`/cars/${result.currentCar.id}`)}
//                   style={{ margin: 0 }}
//                 >
//                   <div className="car-image-wrap">
//                     <img
//                       src={result.currentCar?.urlHinhAnh || IMAGE_FALLBACK}
//                       alt={result.currentCar?.tieuDe}
//                       className="car-image"
//                       onError={(e) => {
//                         e.currentTarget.src = IMAGE_FALLBACK;
//                       }}
//                     />
//                   </div>
//                   <div className="car-card-body">
//                     <h3 style={{ fontSize: "15px" }}>
//                       {result.currentCar?.tieuDe}
//                     </h3>
//                     <p
//                       style={{
//                         fontSize: "20px",
//                         color: "#0ea5e9",
//                         fontWeight: 800,
//                       }}
//                     >
//                       {formatPrice(result.currentCar?.gia)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Gợi ý */}
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "24px",
//                     color: "#0f172a",
//                     marginBottom: "20px",
//                   }}
//                 >
//                   Các Lựa Chọn Thay Thế Tốt Nhất
//                 </h3>
//                 {result.recommendedCars?.length ? (
//                   <div
//                     className="car-grid"
//                     style={{
//                       gridTemplateColumns:
//                         "repeat(auto-fill, minmax(220px, 1fr))",
//                     }}
//                   >
//                     {result.recommendedCars.map((car) => (
//                       <div
//                         key={car.id}
//                         className="car-card"
//                         onClick={() => navigate(`/cars/${car.id}`)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <div className="car-image-wrap">
//                           <img
//                             src={car.urlHinhAnh || IMAGE_FALLBACK}
//                             alt={car.tieuDe}
//                             className="car-image"
//                             onError={(e) => {
//                               e.currentTarget.src = IMAGE_FALLBACK;
//                             }}
//                           />
//                         </div>
//                         <div className="car-card-body">
//                           <h3
//                             style={{
//                               fontSize: "14px",
//                               whiteSpace: "nowrap",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                             }}
//                           >
//                             {car.tieuDe}
//                           </h3>
//                           <p
//                             style={{
//                               fontSize: "16px",
//                               color: "#0ea5e9",
//                               fontWeight: 800,
//                             }}
//                           >
//                             {formatPrice(car.gia)}
//                           </p>
//                           <div
//                             className="car-meta-grid"
//                             style={{
//                               fontSize: "11px",
//                               gridTemplateColumns: "1fr 1fr",
//                             }}
//                           >
//                             <div>
//                               <span>Odo</span>
//                               <strong>{car.soKmDaDi || "-"}</strong>
//                             </div>
//                             <div>
//                               <span>Hộp số</span>
//                               <strong>{car.hopSo || "-"}</strong>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="empty-state">
//                     Chưa có dữ liệu thay thế cho dòng xe này.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// export default SimilarCarsPage;
