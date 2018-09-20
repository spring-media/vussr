const webpack = require('webpack');
const logger = require('./logger');
const { getConfig } = require('../utils/config');

class Compiler {

  constructor(config) {
    this.config = getConfig(config);
    this.compiler = webpack([this.config.client, this.config.server]);
  }

  async run() {
    try {
      const { warnings } = await this.runWebpackCompilerAsPromised()
      warnings.forEach(warning => logger.warn(warning));
      logger.info('🎉 Compilation successful')
    } catch (err) {
      if (err instanceof Error) logger.error(err);
      if (err.warnings) err.warnings.forEach(err => logger.warn(err));
      if (err.errors) err.errors.forEach(err => logger.error(err));
    }
  }

  runWebpackCompilerAsPromised() {
    return new Promise((resolve, reject) => {
      this.compiler.run((err, stats) => {
        const statsAsJson = stats.toJson();
        const errors = statsAsJson.errors || [];
        const warnings = statsAsJson.warnings || [];
        if (err) errors.unshift(err);
        if (errors.length) return reject({ errors, warnings });
        resolve({ errors, warnings })
      })
    })
  }

}

module.exports = Compiler;
