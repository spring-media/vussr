const path = require('path');
const merge = require('webpack-merge');
let client = require('../build/webpack.config.client');
let server = require('../build/webpack.config.server');
let devServer = require('../build/webpack.config.server.dev');
let middlewares = require('../build/middlewares');

function getConfig(options) {
  if (!options){
    return getDefaultConfig();
  }
  if (options.config && options.extend) {
    throw new Error('Can not define config and extend in one command call.');
  }
  if (typeof options.extend === 'string') {
    return getExtendedConfig(options);
  }
  if (typeof options.config === 'string') {
    return getConfigFromFileSystem(options);
  }
  if (typeof options.config === 'object') {
    return getConfigAsObject(options);
  }
}

function getExtendedConfig(options) {
  const extend = require(path.resolve(process.cwd(), options.extend));
  middlewares = Object.assign({}, middlewares, extend.middlewares || {});
  client = merge(client, extend.client || {});
  server = merge(server, extend.server || {});
  devServer = merge(devServer, extend.devServer || {});
  return { client, server, devServer, middlewares };
}

function getConfigFromFileSystem(options) {
  return require(path.resolve(process.cwd(), options.config));
}

function getConfigAsObject(options) {
  return options.config;
}

function getDefaultConfig() {
  return { client, server, devServer, middlewares };
}

module.exports = {
  getConfig,
};
