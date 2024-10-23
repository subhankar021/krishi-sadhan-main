async function verifyUserSession(req, res, next) {
  if (req.session ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || "127.0.0.1";
    const sessionInfo = true;
    if (sessionInfo) {
      next();
    } else {
      return res.status(401).end();
    }
  } else {
    return res.status(401).end();
  }
}

module.exports = verifyUserSession;