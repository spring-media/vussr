const DevServer = require('./lib/server.dev');
const ProdServer = require('./lib/server.prod');
const Compiler = require('./lib/compiler');
const Config = require('./lib/config');
const middleware = require('./lib/middleware');
const webpack = require('./webpack');
const defaultConfig = require('./udssr.config.default');

module.exports = {
  DevServer,
  ProdServer,
  Compiler,
  Config,
  middleware,
  webpack,
  defaultConfig,
};
