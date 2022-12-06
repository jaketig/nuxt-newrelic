exports.generateApmConfig = (options) => {

  let config = {...options}

  // set logging level to info if it isn't set
  if (!config?.logging?.level)
    config.logging = {
      ...(config?.logging || {}),
      level: 'info'
    }

  // set allow_all_headers to true if it isn't set
  if (config.allow_all_headers === undefined)
    config.allow_all_headers = true;

  // set exclude attributes to default if there are none set
  if (!config?.attributes?.exclude) {
    config.attributes = {
      ...(config?.attributes || {}),
      exclude: [
        'request.headers.cookie',
        'request.headers.authorization',
        'request.headers.proxyAuthorization',
        'request.headers.setCookie*',
        'request.headers.x*',
        'response.headers.cookie',
        'response.headers.authorization',
        'response.headers.proxyAuthorization',
        'response.headers.setCookie*',
        'response.headers.x*'
      ]
    }
  }

  return `/* eslint-disable */

/*
  GENERATED FROM NUXT CONFIG
  ANY CHANGES TO THIS FILE WILL BE OVERWRITTEN
*/

'use strict'

exports.config = ${print(config)}`
}

function print(obj) {
  var cleaned = JSON.stringify(obj, null, 2);

  return cleaned.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, function (match) {
      return match.replace(/"/g, "");
  });
}