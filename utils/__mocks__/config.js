const client = require('../../test/__build__/webpack.config.client');
const server = require('../../test/__build__/webpack.config.server');
const devServer = require('../../test/__build__/webpack.config.server.dev');

function getDefaultConfig() {
  return { client, server, devServer };
}

function getConfig (config) {
  if (typeof config === 'string') return require(config);
  if (config) return config;
  return getDefaultConfig();
}

module.exports = {
  getConfig,
  getDefaultConfig
}