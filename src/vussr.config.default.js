const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  entryClient: resolveApp('src/entry.client.js'),
  entryServer: resolveApp('src/entry.server.js'),
  template: resolveApp('public/index.html'),
  outputPath: resolveApp('dist'),
  assetsPath: resolveApp('dist/assets'),
  assetsUrlPath: '/assets/',
  compressHTML: false,
  compressAssets: false,
  filename: '[name].[contenthash:8].js',
  svgSpriteFilename: 'img/sprite.[contenthash:8].svg',
  middleware: { before: [], after: [] },
  copy: [],
  bundleRendererOptions: {},
  server: defaultConfig => defaultConfig,
  client: defaultConfig => defaultConfig,
  devServer: defaultConfig => defaultConfig,
};
