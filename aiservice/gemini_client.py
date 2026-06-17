import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL")
)

def ask_gemini(prompt: str):

    response = client.chat.completions.create(
        model="openai:gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": "Bạn là chuyên gia tư vấn ô tô."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content