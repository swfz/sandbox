import openai

res = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "プレゼン資料作成が終わりません！"}
        ]
    )

print(res.choices[0]["message"]["content"].strip())
