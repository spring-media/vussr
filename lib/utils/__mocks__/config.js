const defaultConfig = require('../../../test/__build__');

function getConfig () {
  return getDefaultConfig();
}

function getDefaultConfig() {
  return defaultConfig;
}

module.exports = {
  getConfig,
  getDefaultConfig
}
