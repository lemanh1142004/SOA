

import pandas as pd
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
    
    # ---------------------------------------------------------
    # TÍNH NĂNG MỚI: BỘ LỌC TÌM KIẾM XE THÔNG MINH
    # ---------------------------------------------------------
    msg_lower = message.lower()
    
    # Danh sách các hãng xe phổ biến
    brands = ["toyota", "honda", "ford", "hyundai", "kia", "mazda", "vinfast", 
              "mercedes", "bmw", "audi", "lexus", "mitsubishi", "chevrolet", "nissan", "suzuki"]
    
    # Xem khách hàng có nhắc đến hãng nào trong câu hỏi không
    found_brands = [b for b in brands if b in msg_lower]
    
    if found_brands:
        # Nếu có, lọc ra những xe thuộc hãng đó
        filtered_df = df[df['brand'].str.lower().isin(found_brands)]
        sample_df = filtered_df.head(20) # Lấy 20 xe liên quan nhất
    else:
        # Nếu hỏi chung chung, lấy ngẫu nhiên 20 xe để đa dạng hóa
        sample_df = df.sample(min(20, len(df))) if not df.empty else df

    # Đưa vào danh sách cho AI
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