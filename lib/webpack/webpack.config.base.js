const CleanWebpackPlugin = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { appPath, appSrc, appDist } = require('../utils/paths');
const { isProd } = require('../utils/env');

const devPlugins = [new VueLoaderPlugin()];

const prodPlugins = [
	new VueLoaderPlugin(),
	new CleanWebpackPlugin(appDist, { root: appPath, verbose: false }),
];

module.exports = {
	mode: isProd() ? 'production' : 'development',
	output: {
		path: appDist,
		publicPath: '/assets/',
		filename: '[name].js',
	},
	node: {
		setImmediate: false,
		process: 'mock',
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty',
	},
	resolve: {
		extensions: ['.vue', '.js', '.json', '.mjs'],
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [appSrc],
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					{ loader: 'postcss-loader', options: { sourceMap: !isProd() } },
				],
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					{ loader: 'postcss-loader', options: { sourceMap: !isProd() } },
					'sass-loader',
				],
			},
			{
				test: /\.(woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 4096,
					name: './fonts/[name].[ext]?[hash]',
				},
			},
			{
				test: /\.(png|jpe?g|gif)$/,
				loader: 'url-loader',
				options: {
					limit: 8000,
					name: './img/[name].[ext]?[hash]',
				},
			},
			{
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: 'graphql-tag/loader',
			},
			{
				test: /\.svg$/,
				loader: 'vue-svg-loader',
			},
			{
				test: /\.txt$/,
				use: 'raw-loader',
			},
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto',
			},
		],
	},
	performance: {
		maxEntrypointSize: 300000,
		hints: false,
	},
	plugins: isProd() ? prodPlugins : devPlugins,
};
