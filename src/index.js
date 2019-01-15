const DevServer = require('./server.dev');
const ProdServer = require('./server.prod');
const Compiler = require('./compiler');
const Config = require('./config');
const middleware = require('./middleware');
const webpack = require('../webpack');
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
