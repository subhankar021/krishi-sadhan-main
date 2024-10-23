const path = require('path');

const instances = 1;

const commonConfig = {
    exec_mode: 'fork',
    instances,
    env: {
        NODE_ENV: 'production',
    },
    env_development: {
        NODE_ENV: 'development',
    },
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    max_memory_restart: '100M'
};

const generateAppConfig = (name, projectPath, scriptPath, args) => ({
    name,
    cwd: projectPath,
    script: scriptPath,
    args,
    ...commonConfig,
    out_file: path.join(__dirname, `./../logs/${name}_OUT.log`),
    error_file: path.join(__dirname, `./../logs/${name}_ERROR.log`),
});

const applications = [
    { name: 'KRISHI_API', projectPath: path.join(__dirname, './../backend/'), scriptPath: 'index.js', args: null },
    { name: 'KRISHI_WEB', projectPath: path.join(__dirname, './../krishi_web/'), scriptPath: 'node_modules/next/dist/bin/next', args: "start -p 8080" },
];

const ecosystemConfig = {
    apps: applications.map(app => generateAppConfig(app.name, app.projectPath, app.scriptPath, app.args)),
};
module.exports = ecosystemConfig;
