const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const getBaseConfig = require('./webpack.config.base');
const { isProd } = require('../src/utils/env');
const defaultConfig = require('../src/vussr.config.default.js');

module.exports = function getClientConfig(config) {
  if (config.template === defaultConfig.template && !fs.existsSync(config.template)) {
    config.template = path.resolve(__dirname, '../src/index.default.html');
  }

  if (!fs.existsSync(config.template)) {
    throw new Error(`Cannot find template file ${config.template}`);
  }

  const htmlWebpackPluginOptions = {
    template: config.template,
    inject: false,
    minify: { removeComments: false },
  };

  const devPlugins = [
    new VueSSRClientPlugin(),
    new HtmlWebpackPlugin(htmlWebpackPluginOptions),
    new WebpackBar({ name: 'Client', color: 'green', compiledIn: false }),
    new webpack.DefinePlugin({ 'process.client': true, 'process.server': false }),
  ];

  const prodPlugins = [
    new VueSSRClientPlugin(),
    new HtmlWebpackPlugin(htmlWebpackPluginOptions),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({ 'process.client': true, 'process.server': false }),
  ];

  return merge(getBaseConfig(config), {
    entry: {
      client: config.entryClient,
    },
    output: {
      filename: config.filename,
    },
    plugins: isProd ? prodPlugins : devPlugins,
    optimization: { minimize: isProd },
  });
};
