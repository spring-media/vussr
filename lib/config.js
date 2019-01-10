const webpackConfig = require('./webpack');
const defaultOptions = require('./config/udssr.config.default')

class Config {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  getWebpackConfig() {
    const client = this.options.client(webpackConfig.client);
    const server = this.options.server(webpackConfig.server);
    const devServer = this.options.devServer(webpackConfig.devServer);
    return { client, server, devServer };
  }

}

module.exports = Config;
