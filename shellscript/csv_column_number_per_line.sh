#!/bin/bash

# CSVを読み込み各行でCSVのカラム数をプリントする
# ./columns.sh hoge.csv

file=$1

lines=$(wc -l ${file} | awk '{print $1}')

echo "${file}"
for i in `seq 1 $lines`; do
  cat ${file} | awk -F ',' "NR==${i}{print NR,NF}"
done

