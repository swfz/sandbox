#!/bin/bash

# csplit -z  work_todo.md "/^## 2022/" "{*}"
# ls xx* | xargs sh -i csplit_and_rename.sh {}

file=$1

md_filelname="$(head -n 1 ${file} | sed -e 's/## //').md"

cp ${file} /path/to/directory/${md_filelname}

echo $md_fielname

