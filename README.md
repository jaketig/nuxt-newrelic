# nuxt-newrelic

A Nuxt 2 Module to add NewRelic APM / Browser monitoring to your project

## Setup

1. Add `nuxt-newrelic` dependency to your project

```bash
npm install @jaketig/nuxt-newrelic
```

2. Add `nuxt-newrelic` to the `modules` section of `nuxt.config.js`

```js
export default {
  modules: [
    '@jaketig/nuxt-newrelic'
  ]
}
```

3. Add `newrelic.js` and `newrelic_agent.log` to .gitignore

```.gitignore
newrelic.js
newrelic_agent.log
```

## Configure 

### Runtime Config

[Runtime config](https://nuxtjs.org/guide/runtime-config) allows the use of environment specific variable at startup. Only `Private Runtime Config` is supported as license keys should not be exposed publicly

```js
export default {
  modules: [
    '@jaketig/nuxt-newrelic'
  ],
  privateRuntimeConfig: {
    newrelic: {
      apm: {
        enabled: true,
        appName: 'YOUR APP NAME HERE',
        licenseKey: 'YOUR LICENSE KEY HERE',
        // additional agent config can be added here
      },
      browser: {
        enabled: false,
        scriptId: 'newrelic',
        accountId: 'YOUR NEW RELIC ACCOUNT ID HERE',
        agentId: 'YOUR NEW RELIC AGENT ID HERE',
        licenseKey: 'YOUR NEW RELIC LICENSE KEY HERE',
        applicationId: 'YOUR NEW RELIC APPLICATION ID HERE'
      }
    }
  },
}
```

### Nuxt Config

[Nuxt config](https://nuxtjs.org/docs/directory-structure/nuxt-config) values are hardcoded at build time

```js
export default {
  modules: [
    '@jaketig/nuxt-newrelic'
  ],
  newrelic: {
    apm: {
      enabled: true,
      appName: 'YOUR APP NAME HERE',
      licenseKey: 'YOUR LICENSE KEY HERE',
      // additional agent config can be added here
    },
    browser: {
      enabled: false,
      scriptId: 'newrelic',
      accountId: 'YOUR NEW RELIC ACCOUNT ID HERE',
      agentId: 'YOUR NEW RELIC AGENT ID HERE',
      licenseKey: 'YOUR NEW RELIC LICENSE KEY HERE',
      applicationId: 'YOUR NEW RELIC APPLICATION ID HERE'
    }
  }
}
```

## Options

### `apm` (object)

- Contents written to `newrelic.js` on build / startup
- Accepts any of the standard [newrelic config options](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration)

### *`enabled`* (boolean)
- Determines if newrelic APM is enabled or not. 
- Defaults to true if production, false if development
- excluded from `newrelic.js` config file

```js
export default {
  newrelic: {
    apm: {
      enabled: true
    }
  }
}
```

### *`app_name`* (string) *required*

- mapped to new relic agent [app_name](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration#app_name)

```js
export default {
  newrelic: {
    apm: {
      app_name: `YOUR APP NAME HERE`       
    }
  }
}
```

### *`license_key`* (string) *required*

- mapped to new relic agent [license_key](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration#license)

```js
export default {
  newrelic: {
    apm: {
      license_key: `YOUR NEWRELIC LICENSE KEY`
    }
  }
}
```

### *Additional Properties*
Any additional fields included in the `apm` object will be included in the generated `newrelic.js` config file. See [New Relic docs](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration) for all available options.

For example, logging can be disabled:

```js
export default {
  newrelic: {
    apm: {
      logging: {
        enabled: false
      }
    }
  }
}
```



### `browser` (object)

- Configures New Relic browser monitoring by adding a script to the page head at build/startup
- Requires APM to be enabled
- Does not support functional nuxt/head 

### *`enabled`* (boolean)

- Determines if newrelic Browser Monitoring is enabled or not. 
- Defaults to false

```js
export default {
  newrelic: {
    browser: {
      enabled: false
    }
  }
}
```

### *`accountId`* (string)
- New Relic account id
- populated in browser script

### *`agentId`* (string)
- New Relic agent id
- populated in browser script

### *`licenseKey`* (string)
- New Relic license key
- populated in browser script

### *`applicationId`* (string)
- New Relic application id
- populated in browser script

## Where do I find the browser settings? 
1. Login to the New Relic portal
2. Click Add Data
3. Choose Browser Monitoring
4. Select Copy/Paste Javascript Code
5. Complete the Name your App section
6. Copy the values from the provided script