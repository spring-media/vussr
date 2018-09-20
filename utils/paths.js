const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  appPath: resolveApp('.'),
  appSrc: resolveApp('src'),
  appDist: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appClientJs: resolveApp('src/entry-client.js'),
  appServerJs: resolveApp('src/entry-server.js'),
  appPackageJson: resolveApp('package.json'),
  isProd,
};
