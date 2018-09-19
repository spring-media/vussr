const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.config.base');
const { appClientJs, isProd } = require('./webpack-utils');

const devPlugins = [
	new VueSSRClientPlugin(),
	new WebpackBar({ name: 'Client', color: 'green' })
];

const prodPlugins = [
	new UglifyJsPlugin({ sourceMap: false }),
	new webpack.optimize.ModuleConcatenationPlugin(),
];

const config = merge(baseConfig, {
	entry: {
		client: appClientJs,
	},
	devtool: isProd ? false : 'cheap-module-eval-source-map',
	plugins: isProd ? prodPlugins : devPlugins
});

module.exports = config;