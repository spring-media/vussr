const chalk = require('chalk');

function logDevServerSuccessMessage(port) {
  console.log(
`
  ${chalk.green('✔ Server has been updated')}

  ${chalk.dim('- App running at')} http://localhost:${this.port}
  ${chalk.dim('- Example article')} http://localhost:${this.port}/article/5b5996b98760980001ed883
`);
};

function logDevServerFailedMessage(stats) {
  console.log(
`
  ${chalk.red('  x Compilation has failed')}
  ${stats.errors.map(err => `\n  - ${err}\n`)}
`);
}

module.exports.logDevServerSuccessMessage = logDevServerSuccessMessage;
module.exports.logDevServerFailedMessage = logDevServerFailedMessage;
