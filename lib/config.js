const client = require('../build/webpack.config.client');
const server = require('../build/webpack.config.server');
const devServer = require('../build/webpack.config.server.dev');
const defaultOptions = require('./config/udssr.config.default')

class Config {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
    this.client = this.options.client || client;
    this.server = this.options.server || server;
    this.devServer = this.options.devServer || devServer;
  }
}

module.exports = Config;
