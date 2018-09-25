const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const baseConfig = require('./webpack.config.base');
const { appServerJs } = require('../../utils/paths');

const resolveApp = file => path.resolve(__dirname, '..', '__app__', file);

// To suppress warnings, this will be fixed with vue 2.6 https://github.com/vuejs/vue/issues/8810
process.noDeprecation = true;

const config = merge(baseConfig, {
	entry: resolveApp('entry.server.js'),
	target: 'node',
	devtool: false,
	plugins: [
		new VueSSRServerPlugin(),
		// We need to disable iconv from the `encoding` npm package to remove issues from the monorepo.
		// This is "ok" to do by design: https://github.com/andris9/encoding/blob/master/lib/encoding.js#L5
		// iconv-lite will automatically be used as a fallback: https://github.com/andris9/encoding#encoding
		new webpack.NormalModuleReplacementPlugin(/\/iconv-loader(.js)?$/, path.resolve(__dirname, 'iconv-loader-hack.js')),
	],
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

module.exports = config;