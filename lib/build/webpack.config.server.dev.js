const { appDist, appPublic } = require('../utils/paths');

module.exports = {
  contentBase: [appDist, appPublic],
  publicPath: '/assets',
  port: 8080,
  compress: false,
  overlay: true,
  quiet: true,
};
