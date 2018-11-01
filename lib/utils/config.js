const path = require('path');
const client = require('../build/webpack.config.client');
const server = require('../build/webpack.config.server');
const merge = require('webpack-merge');
const devServer = require('../build/webpack.config.server.dev');

function getDefaultConfig() {
  return { client, server, devServer };
}

function getConfig (options) {
  if (options.config && options.extend) {
    throw new Error('Can not define config and extend in one command call.')
  }
  if (typeof options.extend === 'string') {
    extend = require(path.resolve(process.cwd(), options.extend));
    console.log(extend.client);
    mergedClient = merge(client, extend.client || {});
    mergedServer = merge(server, extend.server || {});
    mergedDevServer = merge(devServer, extend.devServer || {});
    return {mergedClient, mergedServer, mergedDevServer};
  }
  if (typeof options.config === 'string') return require(path.resolve(process.cwd(), options.config));
  if (options.config) return options.config;
  return getDefaultConfig();
}

module.exports = {
  getConfig
}