#!/bin/bash

# Slack APIのauthを試すテスト

curl -XPOST -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SLACK_API_TOKEN" \
  https://slack.com/api/auth.test

