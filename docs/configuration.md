# Configuration

VUSSR uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig). This means VUSSR has a set of
parameters that can passed to VUSSR in any of these ways (if you use a dedicated file, put it in the
root folder of your project):

- a `vussr` property in `package.json`
- a `.vussrrc` file in JSON or YAML format
- a `.vussrrc.json` file
- a `.vussrrc.yaml`, `.vussrrc.yml`, or `.vussrrc.js` file
- a `vussr.config.js` file exporting a JS object

These are the configurations you can use and their default values (the default `vussr.config.js`). If
you do not use any configuration (which you can do), these are your defaults. Basically this is the
implementation of [`src/vussr.config.default.js`](../src/vussr.config.default.js):

```js
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
  filename: '[name].[chunkhash].js',
  middleware: { before: [], after: [] },
  copy: [],
  server: defaultConfig => defaultConfig,
  client: defaultConfig => defaultConfig,
  devServer: defaultConfig => defaultConfig,
};
```
