const path = require('path');
let client = require('../build/webpack.config.client');
let server = require('../build/webpack.config.server');
let devServer = require('../build/webpack.config.server.dev');
const merge = require('webpack-merge');

function getDefaultConfig() {
  return { client, server, devServer };
}

function getConfig (options) {
  if (options.config && options.extend) {
    throw new Error('Can not define config and extend in one command call.')
  }
  if (typeof options.extend === 'string') {
    extend = require(path.resolve(process.cwd(), options.extend));
    client = merge(client, extend.client || {});
    server = merge(server, extend.server || {});
    devServer = merge(devServer, extend.devServer || {});
    return {client, server, devServer};
  }
  if (typeof options.config === 'string') return require(path.resolve(process.cwd(), options.config));
  if (options.config) return options.config;
  return getDefaultConfig();
}

module.exports = {
  getConfig
}
