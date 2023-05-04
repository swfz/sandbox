import openai

completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "プレゼン資料作成が終わりません！"}
        ],
        stream=True
    )

# print(res.choices[0]["message"]["content"].strip())

for chunk in completion:
    next = chunk["choices"][0]["delta"].get("content", "")
    print(next, end="")
