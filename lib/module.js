import fs from 'fs'
import { generateApmConfig } from './newrelic_config'
import { generateBrowserScript } from './newrelic_browser_script'

export default function () {
  const { nuxt } = this

  const options = {
    ...nuxt.options.newrelic,
    ...nuxt.options.privateRuntimeConfig.newrelic
  }

  const apm_options = options.apm || {};
  const browser_options = options.browser || {};

  // by default enable only in production
  if (apm_options.enabled === undefined)
    apm_options.enabled = !nuxt.options.dev

  // disable browser tracing by default
  if (browser_options.enabled === undefined)
    browser_options.enabled = false

  // stop if apm is disabled
  if (!apm_options.enabled) return;
  delete apm_options.enabled;

  // configure APM
  configureAPM(apm_options);

  // stop if browser is disabled
  if (!browser_options.enabled) return;
  delete browser_options.enabled;

  configureBrowser(this, browser_options);
}

function configureAPM(options) {
  // validate app name
  if (!options.app_name) {
    console.warn('[newrelic] apm app_name not set!')
    return;
  } 
  
  // validate license key
  else if (!options.license_key) {
    console.warn('[newrelic] apm license_key not set!')
    return;
  }

  // write newrelic config file
  fs.writeFileSync('newrelic.js', generateApmConfig(options))
  
  // set newrelic home directory
  process.env['NEW_RELIC_HOME'] = process.cwd()

  // process.env['NEW_RELIC_APP_NAME'] = process.env.NEW_RELIC_APP_NAME || options.appName;
  // process.env['NEW_RELIC_LICENSE_KEY'] = process.env.NEW_RELIC_LICENSE_KEY || options.licenseKey;

  // init apm
  require('newrelic')
}

function configureBrowser(instance, options) {

  // validate browser options
  if (!options.accountId) {
    console.warn('[newrelic] browser accountId not set!')
    return;
  } else if (!options.agentId) {
    console.warn('[newrelic] browser agentId not set!')
    return;
  } else if (!options.licenseKey) {
    console.warn('[newrelic] browser licenseKey not set!')
    return;
  } else if (!options.applicationId) {
    console.warn('[newrelic] browser applicationId not set!')
    return;
  }
  
  // ensure head is not a function
  if (typeof instance.options.head === 'function') {
    console.warn('[newrelic] head is provided as a function which is not supported by this module at the moment. Removing user-provided head.')
    this.options.head = {}
  }

  const scriptId = options.scriptId || 'newrelic';
  
  // read script from external file
  const script = generateBrowserScript(options);
  
  // add script to head
  instance.options.head.script = instance.options.head.script || []
  instance.options.head.script.push({
    hid: scriptId,
    innerHTML: script
  })

  // Disable sanitization
  instance.options.head.__dangerouslyDisableSanitizersByTagID = instance.options.head.__dangerouslyDisableSanitizersByTagID || {}
  instance.options.head.__dangerouslyDisableSanitizersByTagID[scriptId] = ['innerHTML']

}

module.exports.meta = require('../package.json')