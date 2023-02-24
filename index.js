const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs');

async function run() {
  try {
    core.info(`get inputs ...`);
    const url = core.getInput('portainer-url', {required: true});
    const api_key = core.getInput('portainer-api-key', {required: true});
    const endpoint = parseInt(core.getInput('portainer-endpoint', {required: true}));
    const stack = parseInt(core.getInput('portainer-stack', {required: true}));
    const filePath = core.getInput('portainer-stack-file', {required: true})
    
    core.info(`get stack env ...`);
    let stack_data = await axios({ method: 'get', url: `${url}/api/stacks/${stack}`, headers: { 'X-API-Key': api_key } })

    core.info(`get stack file ...`);
    let stack_file = fs.readFileSync(filePath, 'utf-8')
    // let stack_file = await axios({ method: 'get', url: `${url}/api/stacks/${stack}/file`, headers: { 'X-API-Key': api_key } })

    core.info(`update stack & repull image ...`);
    let update = await axios({
      method: 'put',
      url: `${url}/api/stacks/${stack}?endpointId=${endpoint}`,
      headers: { 'X-API-Key': api_key, 'Content-Type': 'application/json' },
      data: JSON.stringify({
        "StackFileContent": stack_file,
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