#  notion to obsidian daily note

Notionに日毎で習慣化のプロパティが存在するページがあり、それを集約したDatabaseがある

[習慣化達成率](https://swfz.notion.site/2e74942314234651bc3a5eb53cac6b47)

Databaseに存在する各日にちの習慣化リストを取得しObsidianのDailyNoteにコンテンツとして追加する

- notion
![alt](notion.png)

このデータを

- daily note
![alt](daily_note.png)

こんな感じにする

## 使い方
- 環境変数`NOTION_DATABASE_ID` にDatabaseIDを設定
- 環境変数`NOTION_TOKEN` にAPI Tokenを設定
- 実行
    - DailyNoteが存在するディレクトリはコマンドライン引数で渡す

```
node habits.js /path/to/obsidian/daily_note
```

## 他
- ObsidianのDailyNoteはYYYY-MM-DD.mdというファイル名で存在する
- DailyNoteのファイルがない場合は新たに作成し習慣化の項目を挿入する
- ファイル内に`Memo`というヘッダーがある場合
    - `Memo`の前に`Habits`という項目を入れて習慣化リストを入れ込む
- ファイル内に`Memo`というヘッダーがない場合
    - ファイルの末尾に追加する
- 過去データの入れ込みで一度きりの実行を想定しているため冪等性などは考慮していない
