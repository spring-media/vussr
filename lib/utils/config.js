const path = require('path');
const client = require('../build/webpack.config.client');
const server = require('../build/webpack.config.server');
const devServer = require('../build/webpack.config.server.dev');

function getDefaultConfig() {
  return { client, server, devServer };
}

function getConfig (config) {
  if (typeof config === 'string') return require(path.resolve(process.cwd(), config));
  if (config) return config;
  return getDefaultConfig();
}

module.exports = {
  getConfig
}