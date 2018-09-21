const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const baseConfig = require('./webpack.config.base');
const { appClientJs, appHtml } = require('../utils/paths');
const { isProd } = require('../utils/env');

const devPlugins = [
	new VueSSRClientPlugin(),
	new WebpackBar({ name: 'Client', color: 'green', compiledIn: false }),
	new HtmlWebpackPlugin({ template: appHtml, minify: { removeComments: false } }),
];

const prodPlugins = [
	new VueSSRClientPlugin(),
	new HtmlWebpackPlugin({ template: appHtml, minify: { removeComments: false } }),
	new webpack.optimize.ModuleConcatenationPlugin(),
];

const config = merge(baseConfig, {
	entry: {
		client: appClientJs,
	},
	devtool: isProd ? false : 'cheap-module-eval-source-map',
	plugins: isProd ? prodPlugins : devPlugins,
	optimization: { minimize: isProd },
});

module.exports = config;