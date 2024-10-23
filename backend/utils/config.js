const { config_directory } = require("./app_storage")
const fs = require("fs-extra");
const path = require('path');
const configFilePath = path.resolve(config_directory, 'config.json');
const initialConfig = {
    system: {
      nodeEnv: "development",
      appPort: 4000
    },
    database: {
      dbHost: "mongodb+srv://krishi-sadhan.qcukn32.mongodb.net",
      dbPort: null,
      dbUser: "app-access",
      dbPassword: "vCHPF35j4m4C545d6GlFrAwX",
      dbName: "krishi-sadhan-dev",
    },
    session: {
      sessionName: null,
      sessionSecret: null
    },
    others: {
      allowlist: [],
      passwordSalt: null
    }
  }

  function isValidConfig(config) {
    if (config === undefined || config === null) {
        return false;
    }
    if (typeof config === "object" && !Array.isArray(config)) {
        for (const [key, value] of Object.entries(config)) {
            if (!isValidConfig(value)) {
                return false;
            }
        }
        return true;
    } else {
        return true;
    }
}    

  function getAppConfig() {
    if (!fs.existsSync(configFilePath)) {
        fs.writeJsonSync(configFilePath, initialConfig);
    }
    const config = fs.readJSONSync(configFilePath);
    
    const isValid = isValidConfig(config);
    return {
        ...initialConfig,
        ...config,
        isValid: isValid,
        system: {
            ...initialConfig.system,
            ...config.system
        },
        database: {
            ...initialConfig.database,
            ...config.database
        },
        session: {
            ...initialConfig.session,
            ...config.session
        },
        others: {
            ...initialConfig.others,
            ...config.others
        }
    }
  }

  function setAppConfig(config) {
    console.log("In setAppConfig", config);
    const existingConfig = getAppConfig();
    fs.writeJsonSync(configFilePath, {
        ...existingConfig,
        ...config,
        system: {
            ...existingConfig.system,
            ...config.system
        },
        database: {
            ...existingConfig.database,
            ...config.database
        },
        session: {
            ...existingConfig.session,
            ...config.session
        },
        others: {
            ...existingConfig.others,
            ...config.others
        }
    });
    return isValidConfig(config);
  }

  module.exports = {
    getAppConfig,
    setAppConfig,
    isValidConfig
  }