const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const getBaseConfig = require('./webpack.config.base');
const { isProd } = require('../src/utils/env');

// To suppress warnings, this will be fixed with vue 2.6 https://github.com/vuejs/vue/issues/8810
process.noDeprecation = true;

/**
 * [1] We need to disable iconv from the `encoding` npm package to remove issues from the monorepo.
 * [1] This is "ok" to do by design: https://github.com/andris9/encoding/blob/master/lib/encoding.js#L5
 * [1] iconv-lite will automatically be used as a fallback: https://github.com/andris9/encoding#encoding
 * [2] https://github.com/socketio/socket.io-client/issues/933#issuecomment-169866929
 */
module.exports = function getServerConfig(config) {
  const relativeAssetsToBase = path.relative(config.assetsPath, config.outputPath);
  const devPlugins = [
    new VueSSRServerPlugin({ filename: relativeAssetsToBase + '/vue-ssr-server-bundle.json' }),
    new WebpackBar({ name: 'Server', color: 'orange', compiledIn: false }),
    new FriendlyErrorsWebpackPlugin({ clearConsole: false }),
    new CopyWebpackPlugin(config.copy),
    new WriteFilePlugin(),
    new webpack.NormalModuleReplacementPlugin( // [1]
      /\/iconv-loader(.js)?$/,
      path.resolve(__dirname, 'iconv-loader-hack.js')
    ),
    new webpack.DefinePlugin({ 'process.client': false, 'process.server': true }),
  ];

  const prodPlugins = [
    new VueSSRServerPlugin({ filename: relativeAssetsToBase + '/vue-ssr-server-bundle.json' }),
    new CopyWebpackPlugin(config.copy),
    new webpack.NormalModuleReplacementPlugin( // [1]
      /\/iconv-loader(.js)?$/,
      path.resolve(__dirname, 'iconv-loader-hack.js')
    ),
    new webpack.DefinePlugin({ 'process.client': false, 'process.server': true }),
  ];

  const output = merge(getBaseConfig(config), {
    entry: config.entryServer,
    target: 'node',
    devtool: 'source-map',
    plugins: isProd ? prodPlugins : devPlugins,
    output: {
      libraryTarget: 'commonjs2',
    },
    externals: nodeExternals({
      whitelist: /\.css$/,
    }),
    optimization: {
      minimize: false,
      splitChunks: false,
    },
    externals: ['ws'], // [2]
  });

  console.log('vussr config server:');
  console.log(JSON.stringify(output, null, 2));
  return output;
};
