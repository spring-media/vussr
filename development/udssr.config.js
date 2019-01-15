const fs = require('fs');
const path = require('path');

const resolveApp = relativePath => path.resolve(__dirname, relativePath);

module.exports = {
  entryClient: resolveApp('src/entry.client.js'),
  entryServer: resolveApp('src/entry.server.js'),
  outputPath: resolveApp('dist'),
  assetsPath: resolveApp('dist/assets'),
  filename: '[name].[chunkhash].js',
  middleware: { before: [], after: [] },
  copy: [],
  server: defaultConfig => defaultConfig,
  client: defaultConfig => defaultConfig,
  devServer: defaultConfig => defaultConfig,
};
