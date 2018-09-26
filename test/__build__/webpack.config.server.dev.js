const path = require('path');

const resolveApp = file => path.resolve(__dirname, '..', '__app__', file);

module.exports = {
  contentBase: resolveApp('dist'),
  publicPath: '/assets',
  port: 8080,
  compress: false,
  overlay: true,
  stats: 'minimal',
  quiet: true,
};
