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

## Explanation

| Name            | Type              | Default                          | Description                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ----------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **entryClient** | string            | `'src/entry.client.js'`          | The entry point for the client                                                                                                                                                                                                                                                                                                                     |
| **entryServer** | string            | `'src/entry.server.js'`          | The entry point for the server                                                                                                                                                                                                                                                                                                                     |
| **template**    | string            | `'public/index.html'`            | The HTML file in which the app will be rendered to                                                                                                                                                                                                                                                                                                 |
| **outputPath**  | string            | `'dist'`                         | The folder where `vussr build` should write the bundle to                                                                                                                                                                                                                                                                                          |
| **assetsPath**  | string            | `'dist/assets'`                  | The folder where `vussr build` should write assets to                                                                                                                                                                                                                                                                                              |
| **filename**    | string            | `'[name].[chunkhash].js'`        | The filenames Webpack should create. [Any placeholder defined by webpack](https://webpack.js.org/configuration/output/#outputfilename) can be used.                                                                                                                                                                                                |
| **middleware**  | object            | `{ before: [], after: [] }`      | You can specifiy and array of middleware that will be run before and after the application                                                                                                                                                                                                                                                         |
| **copy**        | array             | `[]`                             | VUSSR includes the [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin). Pass any of the options you would pass to that plugin here. Example: `[{ from: 'source', to: 'dest' }]`                                                                                                                                          |
| **server**      | function / object | `defaultConfig => defaultConfig` | You can either pass a `function` or an `object` to this option. If you pass an `object`, you have to pass a Webpack configuration that will be used for building the server bundle. If you pass a funcito, that function will _receive_ the server webpack config generated by VUSSR so that you can manipulate it and return your changed config. |
| **client**      | function / object | `defaultConfig => defaultConfig` | This is the same as the `server` config field but for the client.                                                                                                                                                                                                                                                                                  |
| **devServer**   | function / object | `defaultConfig => defaultConfig` | This is the same as the `server` config field but for the Webpack DevServer (See [webpack.js.org > dev-server](https://webpack.js.org/configuration/dev-server/)).                                                                                                                                                                                 |
