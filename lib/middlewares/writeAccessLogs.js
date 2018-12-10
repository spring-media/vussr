const morgan = require('morgan')
const onFinished = require('on-finished')
const chalk = require('chalk');

module.exports = function accessLogs(logFormat) {
  if (logFormat === false) return noop();
  if (logFormat === 'development') return developmentFormat();
  if ([true, undefined, 'clf'].includes(logFormat)) return commonLogFormat();
  throw new Error(`Unknown Access Log Format ${logFormat}`)
};

function noop() {
  return (req, res, next) => next();
};

function developmentFormat() {
  return (req, res, next) => {
    const hrstart = process.hrtime()
    onFinished(res, () => {
      const hrend = process.hrtime(hrstart);
      const time = new Date().toLocaleTimeString();
      const path = req.originalUrl;
      const executionTime = `${hrend[0]}.${Math.round(hrend[1] / 1000000)}s`
      console.log(chalk.dim(`  - ${res.statusCode} ${time} ${executionTime}`), path); // TODO Use logger ("../logger.js")
    })
    next();
  }
}

function commonLogFormat() {
  return morgan('common');
}
