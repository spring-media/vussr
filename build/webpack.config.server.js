const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const baseConfig = require('./webpack.config.base');
const { appServerJs } = require('../utils/paths');
const { isProd } = require('../utils/env');

const devPlugins = [
	new VueSSRServerPlugin(),
	new WebpackBar({ name: 'Server', color: 'orange', compiledIn: false }),
	new FriendlyErrorsWebpackPlugin({ clearConsole: false }),
	// We need to disable iconv from the `encoding` npm package to remove issues from the monorepo.
	// This is "ok" to do by design: https://github.com/andris9/encoding/blob/master/lib/encoding.js#L5
	// iconv-lite will automatically be used as a fallback: https://github.com/andris9/encoding#encoding
	new webpack.NormalModuleReplacementPlugin(/\/iconv-loader(.js)?$/, path.resolve(__dirname, 'iconv-loader-hack.js')),
];

const prodPlugins = [
	new VueSSRServerPlugin(),
	new webpack.NormalModuleReplacementPlugin(/\/iconv-loader(.js)?$/, path.resolve(__dirname, 'iconv-loader-hack.js')),
];

module.exports = merge(baseConfig, {
	entry: appServerJs,
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
	// https://github.com/socketio/socket.io-client/issues/933#issuecomment-169866929
	externals: ['ws'], 
});
