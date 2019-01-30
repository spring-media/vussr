const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  devtool: false,
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: 'assets',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.vue', '.js'],
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
        include: ['src'],
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
