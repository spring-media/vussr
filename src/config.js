const webpackConfig = require('../webpack');
const defaultConfig = require('./udssr.config.default');

class Config {
  constructor(config, cliOptions) {
    this.config = Object.assign({}, defaultConfig, config, cliOptions);
  }

  getJson() {
    return Object.assign({}, this.config, this.getWebpackConfig());
  }

  getWebpackConfig() {
    const client = this.callIfFunction(this.config.client, webpackConfig.client(this.config));
    const server = this.callIfFunction(this.config.server, webpackConfig.server(this.config));
    const devServer = this.callIfFunction(
      this.config.devServer,
      webpackConfig.devServer(this.config)
    );
    return { client, server, devServer };
  }

  callIfFunction(option, ...args) {
    return typeof option === 'function' ? option(...args) : option;
  }
}

module.exports = Config;
