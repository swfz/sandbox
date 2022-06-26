#!/bin/bash

# 9月誕生日の場合、リリースノートのファイルを自動で生成するためのコード
# eg) ./release_note_version.sh 2022-05-01

input_mohth=$1

if [[ -z "$input_month" ]]; then
  target_month=$(date +"%Y-%m-01")
else
  target_month=$(echo ${input_month}-01)
fi

age=$((($(date -d "${target_month}" +"%s") - $(date -d "1987-09-27" +"%s")) / 86400 / 365))
months=(3 4 5 6 7 8 9 10 11 1 2)
index=$(( $(date -d "${target_month}" +"%m") - 1))
filename=$(date -d "${target_month}" +"%Y_%m")-0_${age}_${months[${index}]}.md
