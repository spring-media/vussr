const logger = require('../src/logger');

function logUnhandledErrors() {
  ['unhandledRejection', 'uncaughtException'].forEach(event => {
    process.on(event, err => logger.error(err));
  });
}

module.exports.logUnhandledErrors = logUnhandledErrors;
