const path = require('path');

module.exports = function getDevServerConfig(config) {
  return {
    contentBase: config.assetsPath,
    publicPath: config.assetsUrlPath,
    port: 8080,
    compress: false,
    overlay: true,
    quiet: true,
    disableHostCheck: true,
  };
};
