const logEvents = require("../utils/logEvents");

function logger(req, res, next) {
  logEvents(`${req.url} ${req.origin} ${req.method}`, "requestLog.txt");
  next();
}

module.exports = logger;
