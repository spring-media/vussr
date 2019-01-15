const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const baseConfig = require('./webpack.config.base');
const { appClientJs, appHtml } = require('./paths');
const { isProd } = require('../utils/env');

const htmlWebpackPluginOptions = {
  template: appHtml,
  inject: false,
  minify: { removeComments: false },
};

const devPlugins = [
  new VueSSRClientPlugin(),
  new WebpackBar({ name: 'Client', color: 'green', compiledIn: false }),
  new HtmlWebpackPlugin(htmlWebpackPluginOptions),
  new webpack.DefinePlugin({ 'process.client': true, 'process.server': false }),
];

const prodPlugins = [
  new VueSSRClientPlugin(),
  new HtmlWebpackPlugin(htmlWebpackPluginOptions),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.DefinePlugin({ 'process.client': true, 'process.server': false }),
];

const config = merge(baseConfig, {
  entry: {
    client: appClientJs,
  },
  output: {
    filename: '[name].js?[hash]',
  },
  devtool: isProd() ? false : 'source-map',
  plugins: isProd() ? prodPlugins : devPlugins,
  optimization: { minimize: isProd() },
});

module.exports = config;
