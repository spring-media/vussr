const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.config.base');
const { appClientJs, appHtml, isProd } = require('../utils/paths');

const devPlugins = [
	new VueSSRClientPlugin(),
	new WebpackBar({ name: 'Client', color: 'green' }),
	new HtmlWebpackPlugin({ template: appHtml, minify: { removeComments: false } })
];

const prodPlugins = [
	new UglifyJsPlugin({ sourceMap: false }),
	new webpack.optimize.ModuleConcatenationPlugin(),
	new HtmlWebpackPlugin({ template: appHtml, minify: { removeComments: false } })
];

const config = merge(baseConfig, {
	entry: {
		client: appClientJs,
	},
	devtool: isProd ? false : 'cheap-module-eval-source-map',
	plugins: isProd ? prodPlugins : devPlugins
});

module.exports = config;