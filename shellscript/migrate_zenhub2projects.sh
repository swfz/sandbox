#!/bin/bash -x

# ZenHubで管理してたIssueをMilestone毎にAPIで取得し、Projects（Beta）のPoint->Point,Milestone->Monthへデータをコピーする
# また、Projects（Beta）に既存Issueを紐づける
# 使用例
# ./migrate_zenhub2projects.sh 2022-01


PROJECT_ID=""
ZENHUB_REPO_ID=""
FIELD_MONTH_ID=""
FIELD_POINT_ID=""
FIELD_STATUS_ID=""
FIELD_STATUS_VALUE=""

target_month=$1
target_month_value="$1-01T00:00:00"
repo="" # org/reponame

target_issues=$(gh issue list --json number,title,url,milestone,closed,id --limit 50 --search "repo:${repo} is:closed milestone:"${target_month}"")

echo ${target_issues} \
  | tr -d '[:cntrl:]' \
  | jq -cr '.[]' \
  | while read -r line; do

  sleep 2

  echo '=========='
  echo ${line}
  echo '=========='

  issue_number=$(echo ${line} | jq -cr '.number')
  issue_node_id=$(echo ${line} | jq -cr '.id')
  zenhub_issue=$(curl -XGET https://api.zenhub.io/p1/repositories/${ZENHUB_REPO_ID}/issues/${issue_number} -H "X-Authentication-Token: ${ZENHUB_TOKEN}" -H "Content-Type: application/json")
  echo ${zenhub_issue}
  estimate=$(echo ${zenhub_issue} | jq -cr '.estimate.value' | head -c -1)
  echo ${estimate}

  item_id=$(gh api graphql -f query='
    mutation($project_id: String! $node_id: String!) {
      addProjectNextItem(input: {projectId: $project_id contentId: $node_id}) {
        projectNextItem {
          id
        }
      }
    }' -f project_id=${PROJECT_ID} -f node_id=${issue_node_id} -q '.data.addProjectNextItem.projectNextItem.id')

  gh api graphql -f query='
    mutation($project_id: String! $point_value: String! $point_id: String! $month_id: String! $item_id: String! $month_value: String! $status_id: String! $status_value: Int!) {
      updateMonth: updateProjectNextItemField(
        input: {
          projectId: $project_id
          itemId: $item_id
          fieldId: $month_id
          value: $month_value
        }
      ) {
        projectNextItem {
          id
        }
      }
      updateStatus: updateProjectNextItemField(
        input: {
          projectId: $project_id
          itemId: $item_id
          fieldId: $status_id
          value: $status_value
        }
      ) {
        projectNextItem {
          id
        }
      }
      updatePoint: updateProjectNextItemField(
        input: {
          projectId: $project_id
          itemId: $item_id
          fieldId: $point_id
          value: $point_value
        }
      ) {
        projectNextItem {
          id
        }
      }
    }' -f project_id=${PROJECT_ID} -f point_value=${estimate} -f point_id=${FIELD_POINT_ID} -f month_id=${FIELD_MONTH_ID} -f item_id=${item_id} -f month_value=${target_month_value} -f status_id=${FIELD_STATUS_ID} -f status_value="${FIELD_STATUS_VALUE}"
done

