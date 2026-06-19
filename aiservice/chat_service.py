import pandas as pd
import re # <-- THÊM THƯ VIỆN NÀY LÊN ĐẦU HOẶC DƯỚI PANDAS
from gemini_client import ask_gemini

conversation_history = []

def chat_with_ai(message):
    global conversation_history

    conversation_history.append(message)

    # Chỉ giữ 10 câu gần nhất để tiết kiệm token
    if len(conversation_history) > 10:
        conversation_history.pop(0)

    history_text = "\n".join(conversation_history)

    from main import get_clustered_df
    df = get_clustered_df()
    
    # =========================================================
    # XÓA ĐOẠN CODE LỌC CŨ CỦA BẠN VÀ DÁN ĐOẠN MỚI NÀY VÀO ĐÂY
    # =========================================================
    msg_lower = message.lower()
    
    # Danh sách các hãng xe chuẩn
    brands = ["toyota", "honda", "ford", "hyundai", "kia", "mazda", "vinfast", 
              "mercedes", "bmw", "audi", "lexus", "mitsubishi", "chevrolet", "nissan", "suzuki"]
    
    # 1. Tách câu hỏi của khách thành các từ riêng lẻ
    words = re.findall(r'\w+', msg_lower)
    
    found_brands = set()
    
    # 2. So sánh từng chữ với danh sách hãng xe
    for word in words:
        if len(word) >= 3: 
            for brand in brands:
                if brand.startswith(word):
                    found_brands.add(brand)
                    
    found_brands = list(found_brands) 

    # 3. Quét thêm xem khách có nhắc đến năm sản xuất không
    years_in_msg = re.findall(r'\b(19\d{2}|20\d{2})\b', msg_lower)

    # 4. Truy xuất dữ liệu từ Database
# 4. Truy xuất dữ liệu từ Database
    if found_brands:
        # Nối các hãng tìm được thành chuỗi regex (Ví dụ: 'vinfast|toyota')
        search_pattern = '|'.join(found_brands)
        
        # Quét TÌM TRỰC TIẾP TÊN HÃNG BÊN TRONG CỘT TIÊU ĐỀ thay vì cột brand
        filtered_df = df[df['tieu_de'].str.lower().str.contains(search_pattern, na=False)]
        
        # Ưu tiên lọc thêm theo năm (nếu có nhắc đến số năm)
        if years_in_msg:
            year_filtered = filtered_df[filtered_df['nam_sx'].astype(str).isin(years_in_msg)]
            if not year_filtered.empty:
                filtered_df = year_filtered 
                
        # Lấy 20 xe liên quan nhất đưa cho AI
        sample_df = filtered_df.head(20) 
    else:
        # Nếu hỏi chung chung không rõ hãng, lấy ngẫu nhiên 20 xe
        sample_df = df.sample(min(20, len(df))) if not df.empty else df
    # =========================================================
    # KẾT THÚC PHẦN DÁN CODE MỚI
    # =========================================================

    # Đưa vào danh sách cho AI (PHẦN NÀY GIỮ NGUYÊN)
    cars = []
    for _, row in sample_df.iterrows():
        cars.append({
            "title": row.get("tieu_de", ""),
            "price": row.get("gia", ""),
            "fuel": row.get("nhien_lieu", ""),
            "year": row.get("nam_sx", "")
        })

    prompt = f"""
Lịch sử câu hỏi của khách:
{history_text}

Câu hỏi hiện tại:
{message}

Danh sách xe hiện có trong kho (Đã lọc từ cơ sở dữ liệu ai_car_db):
{cars}

Bạn là chuyên gia tư vấn ô tô. Hãy tư vấn dựa trên lịch sử trò chuyện và câu hỏi hiện tại.
Chỉ được đề xuất các xe có trong danh sách trên. Nếu danh sách rỗng hoặc không có xe phù hợp, hãy xin lỗi và báo là kho hiện chưa có.
Tuyệt đối không được bịa ra xe không có trong danh sách. Trả lời ngắn gọn, thân thiện và chuyên nghiệp.
"""

    return ask_gemini(prompt)