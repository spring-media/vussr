const { promisify } = require('util');
const morgan = require('morgan')
const onFinished = require('on-finished')
const chalk = require('chalk');

const waitOnFinished = promisify(onFinished);

module.exports = function writeAccessLogs(logFormat) {
  if (logFormat === 'development') return developmentFormat();
  if ([true, undefined, 'clf'].includes(logFormat)) return commonLogFormat();
  throw new Error(`Unknown Access Log Format ${logFormat}`)
};

function developmentFormat() {
  return async (req, res, next) => {
    const hrstart = process.hrtime()
    next();
    await waitOnFinished(res);
    const hrend = process.hrtime(hrstart);
    const time = new Date().toLocaleTimeString();
    const path = req.originalUrl;
    const executionTime = `${hrend[0]}.${Math.round(hrend[1] / 1000000)}s`
    console.log(chalk.dim(`  - ${res.statusCode} ${time} ${executionTime}`), path); // TODO Use logger ("../logger.js")
  }
}

function commonLogFormat() {
  return morgan('common');
}
