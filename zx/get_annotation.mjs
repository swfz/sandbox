#!/usr/bin/env zx

// Usage
// zx --quiet get_annotation.mjs owner/repo

const args = argv._.filter(a => a !== path.basename(__filename));
const repo = args[0];

const ghCli = YAML.parse(fs.readFileSync(`${process.env.HOME}/.config/gh/hosts.yml`, 'utf-8').toString());

const request = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${ghCli['github.com'].oauth_token}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    }
  }).then(res => res.json());

  return res;
}

const getLatestWorkflowRuns = async (repo) => {
  const workflowRuns = await request(`https://api.github.com/repos/${repo}/actions/runs?per_page=50`);
  console.log(`Workflow Runs: ${workflowRuns.total_count}`);

  // default 日付降順ぽいのでそのまま使う
  const latestRuns = workflowRuns.workflow_runs.reduce((acc, cur) => {
    if (acc.find(row => row.workflow_id === cur.workflow_id)) {
      return acc
    }
    else {
      return [...acc, cur];
    }
  }, []);

  // console.log(latestRuns)

  return latestRuns;
}

const latestRuns = await getLatestWorkflowRuns(repo);

// console.dir(latestRuns, {depth: null})

let summary = [];

for (let run of latestRuns) {
  const jobResponse = await request(run.jobs_url);
  console.log(`Jobs: ${jobResponse.total_count}`);

  for (let job of jobResponse.jobs) {
    console.log("check_run_url", job.check_run_url);
    const annotations = await request(`${job.check_run_url}/annotations`);
    console.dir(annotations, {depth: null})
    if (annotations.length > 0) {
      summary = summary.concat([{workflow: run.name, url: run.html_url, annotations}])
    }

    console.log(annotations)
  }
}

console.log('summary: ---------------------------------------')
console.dir(summary, {depth: null});

// const annotations = await request(jobs.jobs.at(0).check_run_url + '/annotations')
// console.log(annotations)

