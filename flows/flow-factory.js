const jsonfile = require('jsonfile')
const { prompt, secretPrompt } = require('../utils/helpers')
const secretsFile = './secrets.json'
const Cryptr = require('cryptr')
let cryptr = null

function getSecrets (flowName) {
  if (cryptr === null) {
    const key = secretPrompt('Enter your password: ')
    cryptr = new Cryptr(key)
  }
  let secrets
  try {
    secrets = jsonfile.readFileSync(secretsFile)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log(`Will create new ${secretsFile} for credential storage in plain text`)
      secrets = {}
      secrets[flowName] = undefined
    } else {
      throw (e)
    }
  }
  if (secrets[flowName] === undefined) {
    secrets[flowName] = requestSecretsFromUser(flowName)
    jsonfile.writeFileSync(secretsFile, secrets, { spaces: 2, EOL: '\r\n' })
  }
  const encryptedSecrets = secrets[flowName]
  return {
    userID: cryptr.decrypt(encryptedSecrets.userID),
    password: cryptr.decrypt(encryptedSecrets.password)
  }
}

function requestSecretsFromUser (flowName) {
  const userID = prompt(`Enter your ${flowName} user ID: `)
  const password = secretPrompt(`Enter your ${flowName} password: `)

  return {
    userID: cryptr.encrypt(userID),
    password: cryptr.encrypt(password)
  }
}

function getFlow (flowName) {
  let FlowClass
  if (flowName === 'ynab-flow') {
    const flow = require(`./ynab/ynab-flow`)
    FlowClass = flow.YNABFlow
  } else {
    const flow = require(`./bank/${flowName}`)
    FlowClass = flow
  }
  const secrets = getSecrets(FlowClass.name)
  return new FlowClass(secrets)
}

module.exports = getFlow
