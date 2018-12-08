const path = require('path');
const merge = require('webpack-merge');
let client = require('../build/webpack.config.client');
let server = require('../build/webpack.config.server');
let devServer = require('../build/webpack.config.server.dev');
let middlewares = require('../build/middlewares');

function getConfig(options) {
  let config = null;

  if (!options){
    config = getDefaultConfig();
  }
  if (options.config && options.extend) {
    throw new Error('Can not define config and extend in one command call.');
  }
  if (typeof options.extend === 'string') {
    config = getExtendedConfig(options);
  } else if (typeof options.config === 'string') {
    config = getConfigFromFileSystem(options);
  } else if (typeof options.config === 'object') {
    config = getConfigAsObject(options);
  }

  if (options.parent) {
    const {
      nock,
      record,
      nockPath = '__requestNocks__',
    } = options.parent;
    config = {
      ...config,
      nock,
      record,
      nockPath,
    }
  }

  return config;
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
