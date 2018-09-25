const path = require('path');

const resolveApp = file => path.resolve(__dirname, '..', '__app__', file);
const appDist = resolveApp('dist');
const appPublic = resolveApp('public');

module.exports = {
  contentBase: [appDist, appPublic],
  publicPath: '/',
  port: 8080,
  compress: false,
  overlay: true,
  quiet: true,
};
