const CleanWebpackPlugin = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { isProd } = require('../src/utils/env');

class BuildIdPlugin {
  constructor({ uid, prefix } = {}) {
    this.uid = uid ? uid : this.generateUid();
    this.prefix = prefix;
  }

  generateUid() {
    const randString = Math.random().toString(36);
    const uid = randString.substr(2, 9);
    return uid;
  }

  replaceBuildId(path, data) {
    path = typeof path === 'function' ? path(data) : path;
    const replacement = this.prefix ? `${this.prefix}${this.uid}` : this.uid;
    return path.replace(/\[buildId\]/gi, replacement);
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.mainTemplate.plugin('asset-path', (path, data) =>
        this.replaceBuildId(path, data)
      );
    });
  }
}

const buildIdPlugin = new BuildIdPlugin();

module.exports = function getBaseConfig(config) {
  const devPlugins = [new VueLoaderPlugin(), buildIdPlugin];

  const prodPlugins = [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(config.outputPath, { verbose: false }),
  ];

  return {
    mode: isProd ? 'production' : 'development',
    output: {
      path: config.outputPath,
      publicPath: config.assetsPath,
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
    plugins: isProd ? prodPlugins : devPlugins,
  };
};
