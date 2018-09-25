const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const baseConfig = require('./webpack.config.base');
const { appClientJs, appHtml } = require('../../utils/paths');

const config = merge(baseConfig, {
	entry: {
		client: appClientJs,
	},
	devtool: false,
	plugins: [
		new VueSSRClientPlugin(),
		new HtmlWebpackPlugin({ template: appHtml, minify: { removeComments: false } }),
	]
});

module.exports = config;