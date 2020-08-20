const path = require('path');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  entry: path.resolve(__dirname, '../src/entry.server.js'),
  plugins: [new VueSSRServerPlugin()],
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
  },
  externals: nodeExternals(),
});
