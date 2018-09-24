const { promisify } = require('util');
const webpack = require('webpack');
const logger = require('./logger');
const { getConfig } = require('../utils/config');
const { isProd } = require('../utils/env');

class Compiler {

  constructor(config) {
    this.config = getConfig(config);
    this.compiler = webpack([this.config.client, this.config.server]);
  }

  async run() {
    if (isProd()) logger.info('starting transpilation');
    if (isProd()) logger.info('transpiling...');
    const stats = await promisify(this.compiler.run.bind(this.compiler))();
    const { errors, warnings, children } = stats.toJson();
    const success = !stats.hasErrors();
    const duration = children.reduce((maxTime, child) => Math.max(maxTime, child.time), 0);
    const message = isProd() ? 'finished transpilation' : `finished transpilation in ${duration}ms`
    warnings.forEach(err => logger.warn(err));
    errors.forEach(err => logger.error(err));
    if (isProd()) logger.info(message, { duration, success });
  }

}

module.exports = Compiler;
