const webpack = require('webpack');
const client = require('../build/webpack.config.client');
const server = require('../build/webpack.config.server');
const logger = require('./logger');

const defaultConfig = { client, server };

class Compiler {

  constructor(config = defaultConfig) {
    this.compiler = webpack([config.client, config.server]);
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
