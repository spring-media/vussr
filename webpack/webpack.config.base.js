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
      path: config.assetsPath,
      publicPath: config.assetsUrlPath,
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
          loader: 'file-loader',
          options: {
            name: `fonts/[name].[contenthash:8].[ext]`,
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          loader: 'file-loader',
          options: {
            name: `img/[name].[contenthash:8].[ext]`,
          },
        },
        {
            test: /(manifest\.webmanifest|browserconfig\.xml)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: `[name].[contenthash:8].[ext]`,
                    }
                },
                {
                    loader: 'app-manifest-loader',
                }
            ],
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
        {
          test: /\.svg$/,
          oneOf: [
            {
              resourceQuery: /component/,
              use: ['babel-loader', 'vue-svg-loader'],
            },
            {

              use: {
                loader: 'svg-inline-loader',
                options: { removeSVGTagAttrs: false },
              },
            },
          ]
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
