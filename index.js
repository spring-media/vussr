const DevServer = require('./lib/server.dev');
const ProdServer = require('./lib/server.prod');
const Compiler = require('./lib/compiler');
const middleware = require('./lib/middleware');
const client = require('./build/webpack.config.client');
const server = require('./build/webpack.config.server');
const devServer = require('./build/webpack.config.server.dev');

module.exports = {
  DevServer,
  ProdServer,
  Compiler,
  middleware,
  config: {
    client,
    server,
    devServer,
  }
};
