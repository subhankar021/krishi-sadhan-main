const path = require('path');
const os = require("os")
const app_directory = path.join(os.homedir(), '.ks-aspxp');
const session_directory = path.join(app_directory, 'sessions');
const log_directory = path.join(app_directory, 'logs');
const config_directory = path.join(app_directory, 'config');

module.exports = {
    app_directory,
    session_directory,
    log_directory,
    config_directory
};
