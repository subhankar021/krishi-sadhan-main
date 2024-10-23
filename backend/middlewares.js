const { getLogger } = require("log4js");
const log4js = require("log4js");
const { getAppConfig } = require("./utils/config");
const { default: mongoose } = require("mongoose");
const appConfig = getAppConfig();
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`Can't find - ${req.originalUrl}`);
    next(error);
}

function errorHandler(err, req, res, next) {
    console.log(err);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    return res.status(statusCode).json({
        message: err.message,
        stack: appConfig.system.nodeEnv === 'production' ? 'Not available' : err.stack,
    });
}

async function connectDatabase(req, res, next) {
    if(mongoose.connection.readyState === 0) {
        await mongoose.connect(appConfig.database.dbHost, {
            dbName: appConfig.database.dbName,
            user: appConfig.database.dbUser,
            pass: appConfig.database.dbPassword,
            retryWrites: true,
            autoCreate: true,
            autoIndex: true,
            auth: {
                password: appConfig.database.dbPassword,
                username: appConfig.database.dbUser
            }
        }); 
    }
    next();
}

module.exports = {
    notFound,
    errorHandler,
    connectDatabase
};