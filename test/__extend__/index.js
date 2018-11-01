const client = require('./webpack.config.client');
const server = require('./webpack.config.server');
const devServer = require('./webpack.config.server.dev');

module.exports = { client, server, devServer };