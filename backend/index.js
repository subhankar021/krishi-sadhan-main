const fs = require("fs-extra");
const mongoose = require("mongoose");
const { app_directory, session_directory, log_directory, config_directory } = require("./utils/app_storage");
fs.ensureDirSync(app_directory);
fs.ensureDirSync(session_directory);
fs.ensureDirSync(log_directory);
fs.ensureDirSync(config_directory);

const app = require("./app");


const { getAppConfig } = require("./utils/config");
const { createCategories } = require("./static_generate");
const appConfig = getAppConfig();
const port = 9081 || process.env.PORT || appConfig.system.appPort;


function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
}

const ipAddress = getIPAddress();
process.env.TZ = "Asia/Kolkata";
app.listen(port, () => {
  mongoose.connect(appConfig.database.dbHost, {
    dbName: appConfig.database.dbName,
    retryWrites: true,
    autoCreate: true,
    // autoIndex: true,
    auth: {
      password: appConfig.database.dbPassword,
      username: appConfig.database.dbUser
    }
  }).then(() => {
    console.log("Database connected");
    // createCategories();
  }).catch(err => {
    console.log(err);
  });
  console.log(`------------------------------------`);
  console.log(`APP SERVER IS RUNNING ON ${port}`);
  console.log(" ");
  console.log(`WEB WAITING @ http://${ipAddress}:${port}/`);
  console.log(" ");
  console.log(`------------------------------------`);
  console.log(`App directory:     ${app_directory}`);
  console.log(`Session directory: ${session_directory}`);
  console.log(`Log directory:     ${log_directory}`);
  console.log(`Config directory:  ${config_directory}`);
  console.log(`------------------------------------`);
});