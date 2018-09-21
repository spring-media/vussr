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
    logger.info('starting transpilation');
    if (isProd) logger.info('transpiling...');
    const hrStart = process.hrtime();
    const stats = await promisify(this.compiler.run.bind(this.compiler))();
    const hrEnd = process.hrtime(hrStart);
    const duration = hrEnd[0] * 1000 + Math.round(hrEnd[1] / 1000000);
    const { errors, warnings, } = stats.toJson();
    const success = !stats.hasErrors();
    const message = isProd ? 'finished transpilation' : `finished transpilation in ${duration}ms`
    warnings.forEach(err => logger.warn(err));
    errors.forEach(err => logger.error(err));
    logger.info(message, { duration, success })
  }

}

module.exports = Compiler;
