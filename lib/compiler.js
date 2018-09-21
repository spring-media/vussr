const { promisify } = require('util');
const webpack = require('webpack');
const logger = require('./logger');
const { getConfig } = require('../utils/config');

class Compiler {

  constructor(config) {
    this.config = getConfig(config);
    this.compiler = webpack([this.config.client, this.config.server]);
  }

  async run() {
    const stats = await promisify(this.compiler.run.bind(this.compiler))();
    const { errors, warnings } = stats.toJson();
    warnings.forEach(err => logger.warn(err));
    errors.forEach(err => logger.error(err));
    logger.info(`Compilation ${stats.hasErrors() ? 'failed' : 'successful'}`);
  }

}

module.exports = Compiler;
