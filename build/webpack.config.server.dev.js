const { appDist, appPublic } = require('./webpack-utils');

module.exports = {
  contentBase: [appDist, appPublic],
  publicPath: '/',
  port: 8080,
  compress: false,
  overlay: true,
  quiet: true,
};
