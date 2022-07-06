#!/bin/bash

# 特定のPRをProjectへ紐づける
# 月ごとにPRを分けて紐づけていく


TARGET_DATE=2020-06-01
FIELD_STATUS_ID=""
FIELD_STATUS_VALUE=
FIELD_POINT_ID=""
FIELD_MONTH_ID=""
FIELD_MONTH_VALUE=${TARGET_DATE}

PR_SEARCH_END_DATE=$(date -d "${TARGET_DATE} 1 month" +"%Y-%m-01")

if [ -z $GH_PROJECT_ID ]; then
  echo "please set GH_PROJECT_ID environment variable and try again."
  exit 1
fi

target_pull_requests=$(gh pr list --json number,title,url,id --limit 50 --search "repo:swfz/til is:closed article in:title merged:${TARGET_DATE}..${PR_SEARCH_END_DATE}")

echo ${target_pull_requests} \
  | tr -d '[:cntrl:]' \
  | jq -cr '.[]' \
  | while read -r line; do

  sleep 1

  echo '=========='
  echo ${line}
  echo '=========='

  pr_node_id=$(echo ${line} | jq -cr '.id')

  echo ${pr_node_id}
  echo ${GH_PROJECT_ID}

  item_id=$(gh api graphql -f query='
    mutation($project_id: ID! $node_id: ID!) {
      addProjectV2ItemById(input: {projectId: $project_id contentId: $node_id}) {
        item {
          id
        }
      }
    }' -f project_id=${GH_PROJECT_ID} -f node_id=${pr_node_id} -q '.data.addProjectV2ItemById.item.id')

  gh api graphql -f query='
    mutation($project_id: ID! $point_value: Float! $point_id: ID! $month_id: ID! $item_id: ID! $month_value: Date! $status_id: ID! $status_value: String!) {
      updateMonth: updateProjectV2ItemFieldValue(
        input: {
          projectId: $project_id
          itemId: $item_id
          fieldId: $month_id
          value: {
            date: $month_value
          }
        }
      ) {
        projectV2Item {
          id
        }
      }
      updateStatus: updateProjectV2ItemFieldValue(
        input: {
          projectId: $project_id
          itemId: $item_id
          fieldId: $status_id
          value: {
            singleSelectOptionId: $status_value
          }
        }
      ) {
        projectV2Item {
          id
        }
      }
      updatePoint: updateProjectV2ItemFieldValue(
        input: {
          projectId: $project_id
          itemId: $item_id
          fieldId: $point_id
          value: {
            number: $point_value
          }
        }
      ) {
        projectV2Item {
          id
        }
      }
  }' -f project_id=${GH_PROJECT_ID} -F point_value=1 -f point_id=${FIELD_POINT_ID} -f month_id=${FIELD_MONTH_ID} -f item_id=${item_id} -f month_value=${FIELD_MONTH_VALUE} -f status_id=${FIELD_STATUS_ID} -f status_value="${FIELD_STATUS_VALUE}"
done
