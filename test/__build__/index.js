const client = require('./webpack.config.client');
const server = require('./webpack.config.server');
const devServer = require('./webpack.config.devServer');
const middlewares = require('./middlewares');

module.exports = { client, server, devServer, middlewares };
