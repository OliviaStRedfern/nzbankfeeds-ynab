const jsonfile = require('jsonfile')
const { prompt, secretPrompt } = require('../utils/helpers');
const secretsFile = "./secrets.json"
const fs = require('fs');

function getSecrets(flowName) {
    let secrets;
    try {
        secrets = jsonfile.readFileSync(secretsFile);
    } catch(e) {
        if (e.code === "ENOENT") {
            console.log(`Will create new ${secretsFile} for credential storage in plain text`);
            secrets = {};
            secrets[flowName] = undefined;
        } else {
            throw(e);
        }
    }
    if (secrets[flowName] === undefined) {
        secrets[flowName] = requestSecretsFromUser(flowName);
        let fd = jsonfile.writeFileSync(secretsFile, secrets, { spaces: 2, EOL: '\r\n' });
        fs.close(fd);
    }
    return secrets[flowName];
}

function requestSecretsFromUser(flowName) {
    const userID = prompt(`Enter your ${flowName} user ID: `);
    const password = secretPrompt(`Enter your ${flowName} password: `);

    return { userID, password};
}

function getFlow(flowName) {
    const flow = require(`./${flowName}`);
    let FlowClass;
    if (flowName === "ynab-flow") {
        FlowClass = flow.YNABFlow;
    } else {
        FlowClass = flow;
    }
    const secrets = getSecrets(FlowClass.name);
    return new FlowClass(secrets);
}

module.exports = getFlow;
