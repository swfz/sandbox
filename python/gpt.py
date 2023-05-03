import openai

res = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "プレゼン資料作成が終わりません！"}
        ]
    )

print(res.choices[0]["message"]["content"].strip())
