const webpackConfig = require('../webpack');
const defaultOptions = require('./udssr.config.default');

class Config {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  getJson() {
    return Object.assign({}, this.options, this.getWebpackConfig());
  }

  getWebpackConfig() {
    const client = this.callIfFunction(this.options.client, webpackConfig.client(this.options));
    const server = this.callIfFunction(this.options.server, webpackConfig.server(this.options));
    const devServer = this.callIfFunction(
      this.options.devServer,
      webpackConfig.devServer(this.options)
    );
    return { client, server, devServer };
  }

  callIfFunction(option, ...args) {
    return typeof option === 'function' ? option(...args) : option;
  }
}

module.exports = Config;
