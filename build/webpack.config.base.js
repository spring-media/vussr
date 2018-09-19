const { VueLoaderPlugin } = require('vue-loader');
const { appSrc, appDist, isProd } = require('./webpack-utils');

module.exports = {
	mode: isProd ? 'production' : 'development',
	output: {
		path: appDist,
		publicPath: '/',
		filename: '[name].[chunkhash].js',
	},
	node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
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
					{ loader: 'postcss-loader', options: { sourceMap: !isProd } },
				],
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					{ loader: 'postcss-loader', options: { sourceMap: !isProd } },
					'sass-loader',
				],
			},
			{
				test: /\.(png|jpe?g|gif|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 4096,
          name: '[name].[hash:8].[ext]'
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
				test: /\.mjs$/,
				include: /node_modules/,
				type: "javascript/auto",
			}			
		],
	},
	performance: {
		maxEntrypointSize: 300000,
		hints: false,
	},
	plugins: [
		new VueLoaderPlugin(),
	],
};
