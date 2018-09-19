const DevServer = require('./lib/server.dev');
const ProdServer = require('./lib/server.prod');
const Compiler = require('./lib/compiler');
const middleware = require('./lib/middleware');

module.exports = {
  DevServer,
  ProdServer,
  Compiler,
  middleware
};
