const merge = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  entry: '../src/entry.client.js',
  plugins: [new VueSSRClientPlugin()],
});
