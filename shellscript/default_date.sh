#!/bin/bash


date_arg=$1


[ -z ${date_arg} ] && target_date=$(date +"%Y-%m-%d") || target_date=${date_arg}

echo $target_date
