const { promisify } = require('util');
const morgan = require('morgan');
const onFinished = require('on-finished');
const chalk = require('chalk');
const logger = require('../logger.js');

const waitOnFinished = promisify(onFinished);

module.exports = function accessLogs(logFormat) {
  if (logFormat === 'development') return developmentFormat();
  if ([true, undefined, 'clf'].includes(logFormat)) return commonLogFormat();
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
    const executionTime = `${hrend[0]}.${Math.round(hrend[1] / 1000000)}s`;
    const message = chalk.dim(`  - ${res.statusCode} ${time} ${executionTime} `) + path;
    const prefix = false;
    logger.info({ message, prefix });
  };
}

function commonLogFormat() {
  return morgan('common');
}
