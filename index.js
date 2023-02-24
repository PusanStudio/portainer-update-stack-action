const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {
    core.info(`get inputs ...`);
    const url = core.getInput('portainer-url');
    const api_key = core.getInput('portainer-api-key');
    const endpoint = core.getInput('portainer-endpoint');
    const stack = core.getInput('portainer-stack');
    
    core.info(`get stack env ...`);
    let stack_data = await axios({method: 'get',url: `${url}/api/stacks/${stack}`,headers: { 'X-API-Key': api_key}})

    core.info(`get stack file ...`);
    let stack_file = await axios({method: 'get',url: `${url}/api/stacks/${stack}/file`,headers: { 'X-API-Key': api_key}})

    core.info(`update stack & pull image ...`);
    let update = await axios({
      method: 'put',
      url: `${url}/api/stacks/${stack}?endpointId=${endpoint}`,
      headers: { 'X-API-Key': api_key, 'Content-Type': 'application/json'},
      data : JSON.stringify({
        "StackFileContent": stack_file.data.StackFileContent,
        "Env": stack_data.data.Env,
        "Prune": false,
        "PullImage": true
      })
    })

    core.setOutput('status', update.status);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();