#!/bin/bash

# 使用時は実際のディレクトリに変更する
DIRECTORY="/path/to/daily_note"

# daily_note ディレクトリ内の .md ファイルをループ処理
for file in $DIRECTORY/*.md; do
  # タグが存在するかどうかをチェック
  if ! grep -q "tags: #daily" "$file"; then
    # ファイル名から年と月を抽出
    year=$(basename $file | cut -c 1-4)
    month=$(basename $file | cut -c 6-7)

    echo "$file"
    # 新しいタグを追加
    echo "\n\ntags: #daily/$year/$month" >> $file
  fi
done

echo "処理が完了しました。"
