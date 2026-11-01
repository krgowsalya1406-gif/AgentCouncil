from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6-luna",
    input="Analyze this problem: Should I spend ₹30,000 on my project?"
)

print(response.output_text)