const jsonfile = require('jsonfile')
const { prompt, secretPrompt } = require('../utils/helpers')
const secretsFile = './secrets.json'
const Cryptr = require('cryptr')
const check = 'little fluffy clouds'
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
      secrets = {
        check: cryptr.encrypt(check),
        flowName: undefined,
      }
    } else {
      throw (e)
    }
  }
  if (cryptr.decrypt(secrets.check) !== check) {
    console.log('There was a problem opening your secrets file, did you enter your password wrong?')
    return null
  }
  if (secrets[flowName] === undefined) {
    secrets[flowName] = requestSecretsFromUser(flowName)
    jsonfile.writeFileSync(secretsFile, secrets, { spaces: 2, EOL: '\r\n' })
  }
  const encryptedSecrets = secrets[flowName]
  return {
    userID: cryptr.decrypt(encryptedSecrets.userID),
    password: cryptr.decrypt(encryptedSecrets.password),
  }
}

function requestSecretsFromUser (flowName) {
  const userID = prompt(`Enter your ${flowName} user ID: `)
  const password = secretPrompt(`Enter your ${flowName} password: `)

  return {
    userID: cryptr.encrypt(userID),
    password: cryptr.encrypt(password),
  }
}

function getFlow (flowName) {
  let FlowClass
  let secrets
  if (flowName === 'ynab-flow') {
    const flow = require(`./ynab/ynab-flow`)
    FlowClass = flow.YNABFlow
    // secrets is intentionally undefined in this case
  } else {
    FlowClass = require(`./bank/${flowName}`)
    secrets = getSecrets(FlowClass.name)
  }
  return new FlowClass(secrets)
}

module.exports = getFlow
