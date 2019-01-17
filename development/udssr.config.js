const path = require('path');

const resolveApp = relativePath => path.resolve(__dirname, relativePath);

module.exports = {
  entryClient: resolveApp('src/entry.client.js'),
  entryServer: resolveApp('src/entry.server.js'),
  template: resolveApp('public/index.html'),
  outputPath: resolveApp('dist/[buildId]'),
  assetsPath: resolveApp('dist/[buildId]/assets'),
  filename: '[name].js',
  middleware: { before: [], after: [] },
  copy: [],
  server: defaultConfig => defaultConfig,
  client: defaultConfig => defaultConfig,
  devServer: defaultConfig => defaultConfig,
};
