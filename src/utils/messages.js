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
  logger.info({ message: devFail(stats), prefix: false });
  stats.errors.forEach(err => logger.error(err));
}

module.exports.logDevSuccess = logDevSuccess;
module.exports.logDevFail = logDevFail;
