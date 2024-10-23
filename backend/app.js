const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const log4js = require("log4js");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const path = require('path');
const bodyparser = require("body-parser");
const middlewares = require('./middlewares');
const fs = require("fs-extra");
const os = require("os");
const FileStore = require('session-file-store')(session);

const { app_directory, session_directory, log_directory, config_directory } = require("./utils/app_storage");

const api = require('./api');
const { getAppConfig } = require('./utils/config');
const dayjs = require('dayjs');
const Categories = require('./database/models/categories');
const { getPrimaryKey } = require('./database');

const app = express();


log4js.configure({
  appenders: {
    console: { type: "console" },
    file: {
      type: "dateFile",
      filename: `${log_directory}/access-details.log`,
      pattern: "yyyy_MM_dd",
      alwaysIncludePattern: true,
      numBackups: 30,
      keepFileExt: true,
      fileNameSep: "_",
    },
  },
  categories: {
    access: { appenders: ["file", "console"], level: "info" },
    default: { appenders: ["console"], level: "info" },
  },
});


var logger = log4js.getLogger("access");

app.use(
  log4js.connectLogger(logger, {
    level: "auto",
    format: ":remote-addr :method :url :status :response-time ms",
  })
);
app.use("/pub/equipment-images/", express.static(path.join(app_directory, "equipment_images")));

const appConfig = getAppConfig();
// session time is 30 days
const sessionTime = 30 * 24 * 60 * 60 * 1000;
app.use(session({
  store: new FileStore({ 
    path: session_directory, 
    ttl: sessionTime / 1000,
    reapInterval: -1,
    logFn: (log) => logger.info(log),
    secret: appConfig.session.sessionSecret
  }),
  secret: appConfig.session.sessionSecret || 'keyboard cat',
  resave: true,
  rolling: true,
  saveUninitialized: true,
  name: appConfig.session.sessionName || 'SESSID',
  cookie: {
    signed: true,
    maxAge: sessionTime,
    sameSite: "strict"
  },
}));
app.use(cookieparser());
app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.disable('etag');
app.use(helmet());

const allowlist = [...appConfig.others.allowlist];
const corsOptionsDelegate = function (req, callback) {
  allowlist.push(req.header('Origin'));
  var corsOptions;
  if (allowlist && allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: true, methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
      optionsSuccessStatus: 200,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept', 'Content-Disposition'],
      exposeHeaders: ['Content-Disposition']
    }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate));
app.use(express.json());

app.use((req, res, next) => {
  // console.log("Auth token: ", req.headers.authorization);
  // console.log("Cookies: ", req.cookies);
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
});


app.get('/', async (req, res) => {
  return res.status(200).end();
});

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204);
});
app.use(middlewares.connectDatabase);
app.use('/api/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
module.exports = app;
