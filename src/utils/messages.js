const chalk = require('chalk');
const logger = require('../logger');

const devSuccess = port => `
  ${chalk.green('✔ Server has been updated')}

  ${chalk.dim('- App running at')} http://localhost:${port}
  ${chalk.dim('- Example article')} http://localhost:${port}/article/5b5996b98760980001ed8831
`;

const devFail = () => `
  ${chalk.red('✖ Compilation has failed')}
`;

function logDevSuccess(port) {
  logger.info({ message: devSuccess(port), prefix: false });
}

function logDevFail(stats) {
  const errors = getErrors(stats);
  logger.info({ message: devFail(), prefix: false });
  errors.forEach(err => logger.error(err));
}

function getErrors(stats) {
  if (stats.errors) return stats.errors;
  if (stats.compilation) return stats.compilation.errors;
  if (stats.stats) return getErrors(stats.stats);
  if (Array.isArray(stats)) {
    const allErrors = stats.map(subStats => getErrors(subStats));
    return allErrors.reduce((acc, cur) => [...acc, ...cur], []);
  }
  throw new Error('Could not read errors from stats');
}

module.exports.logDevSuccess = logDevSuccess;
module.exports.logDevFail = logDevFail;
