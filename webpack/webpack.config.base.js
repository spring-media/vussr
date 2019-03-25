const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { isProd } = require('../src/utils/env');

module.exports = function getBaseConfig(config) {
  const devPlugins = [new VueLoaderPlugin()];

  const prodPlugins = [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(config.outputPath, { verbose: false }),
  ];

  const relativeAssetsPath = path.relative(config.outputPath, config.assetsPath);

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'source-map',
    context: process.cwd(),
    output: {
      path: config.outputPath,
      publicPath: `/${relativeAssetsPath}/`,
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
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }],
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'sass-loader',
          ],
        },
        {
          test: /\.(woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 4096,
            name: `./${relativeAssetsPath}/fonts/[name].[ext]?[hash]`,
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: `./${relativeAssetsPath}/img/[name].[ext]?[hash]`,
          },
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
        {
          test: /\.svg$/,
          use: ['babel-loader', 'vue-svg-loader'],
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
    plugins: isProd ? prodPlugins : devPlugins,
  };
};
