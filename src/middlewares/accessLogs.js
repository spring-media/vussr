const { promisify } = require('util');
const morgan = require('morgan');
const requestId = require('./requestId');
const onFinished = require('on-finished');
const chalk = require('chalk');
const logger = require('../logger.js');

const waitOnFinished = promisify(onFinished);

module.exports = function accessLogs(logFormat) {
  morgan.token('pid', () => {
    return requestId.get() || 'unknown';
  });

  if (logFormat === 'development') return developmentFormat();
  if (logFormat === 'combined') return combinedLogFormat();
  if ([true, undefined, 'common', 'clf'].includes(logFormat)) return commonLogFormat();
  if (logFormat === false) return (req, res, next) => next();
  throw new Error(`Unknown Access Log Format "${logFormat}"`);
};

function developmentFormat() {
  return async (req, res, next) => {
    const hrstart = process.hrtime();
    next();
    await waitOnFinished(res);
    const hrend = process.hrtime(hrstart);
    const time = new Date().toLocaleTimeString();
    const path = req.originalUrl;
    const executionTime = `${hrend[0]}.${Math.round(hrend[1] / 100000)}s`;
    const message = chalk.dim(`  - ${res.statusCode} ${time} ${executionTime} `) + path;
    const prefix = false;
    logger.info({ message, prefix });
  };
}

function combinedLogFormat() {
  // combined format extended by pid
  return morgan(
    ':remote-addr - :remote-user [:date[clf]] ' +
    '":method :url HTTP/:http-version" ' +
    ':status :res[content-length] ' +
    '":pid" ":referrer" ":user-agent"'
  );
}

function commonLogFormat() {
  // commen format extended by pid
  return morgan(
    ':remote-addr - :remote-user [:date[clf]] ' +
    '":method :url HTTP/:http-version" ' +
    ':status :res[content-length] ":pid"'
  );
}
