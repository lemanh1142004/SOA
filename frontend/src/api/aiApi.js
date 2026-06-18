import axios from "axios";

// Cổng 8080 là cổng của Gateway API, nó sẽ tự động điều phối sang 5003 cho mình
const AI_API_URL = "https://gateway-api-ngbw.onrender.com/api/ai";
export const getAssociationRules = async () => {
  try {
    const response = await axios.get(`${AI_API_URL}/association-rules`);
    return response.data; // Dữ liệu trả về sẽ chứa 'count' và mảng 'rules'
  } catch (error) {
    console.error("Lỗi khi gọi API Luật kết hợp:", error);
    throw error;
  }
};
