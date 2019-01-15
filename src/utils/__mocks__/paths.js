const path = require('path');

const resolveApp = relativePath =>
  path.resolve(__dirname, '..', '..', 'test', '__app__', relativePath);

module.exports = {
  appPath: resolveApp('.'),
  appSrc: resolveApp('.'),
  appDist: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('index.html'),
  appClientJs: resolveApp('entry-client.js'),
  appServerJs: resolveApp('entry-server.js'),
  appPackageJson: resolveApp('package.json'),
};
