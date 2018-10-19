const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const baseConfig = require('./webpack.config.base');

const resolveApp = file => path.resolve(__dirname, '..', '__app__', file)

const config = merge(baseConfig, {
	entry: {
		client: resolveApp('entry.client.js'),
	},
	devtool: false,
	plugins: [
		new VueSSRClientPlugin(),
		new HtmlWebpackPlugin({ template: resolveApp('index.html'), minify: { removeComments: false } }),
	]
});

module.exports = config;