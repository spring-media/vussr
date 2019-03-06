const cosmiconfig = require('cosmiconfig');
const logger = require('../src/logger');

function logUnhandledErrors() {
  ['unhandledRejection', 'uncaughtException'].forEach(event => {
    process.on(event, err => logger.error(err));
  });
}

async function getConfig() {
  const explorer = cosmiconfig('vussr');
  const cosmiConfigResult = await explorer.search();
  return cosmiConfigResult ? cosmiConfigResult.config : {};
}

module.exports.logUnhandledErrors = logUnhandledErrors;
module.exports.getConfig = getConfig;
