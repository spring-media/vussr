const merge = require('webpack-merge');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  entry: '../src/entry.server.js',
  plugins: [new VueSSRServerPlugin()],
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
  },
});
