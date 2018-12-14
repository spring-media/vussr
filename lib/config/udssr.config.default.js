const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
	entryClient: resolveApp('entry.client.js'),
	entryServer: resolveApp('entry.server.js'),
	outputPath: resolveApp('dist'),
	assetsPath: resolveApp('dist/assets'),
  filename: '[name].[chunkhash].js',
	middleware: { before: [], after: [] },
	copy: [],
	server: defaultConfig => defaultConfig,
	client: defaultConfig => defaultConfig,
	devServer: defaultConfig => defaultConfig,
};
