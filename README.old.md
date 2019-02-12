![vuedssr logo](./docs/vussr-logo.svg)

# ✊ VUSSR

Development and Production Server Side Renderer for VUE

## About

vussr provides you with a Webpack DevServer for development and an Express Server for production to
render your VUE application on the server and hydrate it on the client. It comes with a command
line API to run your app:

```
Usage: vussr [options] [command]

Options:

  -v, --version    output the version number
  -h, --help       output usage information

Commands:

  build [options]  Creates a production build
  start [options]  Starts a formerly created build with the production server
  serve [options]  Serves the app with hot reloading for development
```

vussr has a [built in Webpack configuration](https://github.com/spring-media/red-vussr/tree/master/lib/config) but you can easily provide your own webpack config.

## Installing

Simply do either

```console
yarn add spring-media/red-vussr
npm install spring-media/red-vussr --save
```

And set up your `package.json` scripts:

```json
{
  "scripts": {
    "serve": "vussr serve --config path/to/your/config.js",
    "build": "vussr build --config path/to/your/config.js",
    "start": "vussr start --config path/to/your/config.js"
  }
}
```

## Using the CLI and the `--config` parameter

vussr has a [built in Webpack configuration](https://github.com/spring-media/red-vussr/tree/master/lib/config) but you can easily provide your own webpack config. However, you need to provide separate configs for your client, server and dev server as server side rendering generally needs different configuration than client side JavaScript.

[Read about configuring Vue for server side rendering on the Vue docs](https://ssr.vuejs.org/guide/build-config.html) or have a look at our [built in Webpack configuration](https://github.com/spring-media/red-vussr/tree/master/lib/config).

Aside from configuration for the client and the server, you must also provide a configuration for the Webpack DevServer

To tell vussr which configuration is for the client, the server and the dev server you must pass a JSON file or a JavaScript file exporting JSON that contains the following fields:

```js
{
  "client": { /* a webpack configuration for the client */ },
  "server": { /* a webpack configuration for the server */ },
  "devServer": { /* a webpack configuration for the Webpack DevServer */ },
}
```

You can pass the path to this file as the `--config` parameter. `client` and `server` should contain
individual [Webpack configurations](https://webpack.js.org/configuration/#options) (the thing you would usually pass to webpack). The `devServer` should a an object containing [the options you would pass as `devServer` to a regular Webpack configuration](https://webpack.js.org/configuration/dev-server/).

To make things easier, we would advise you to write indiviual configurations as you would with a
vanilla Webpack SSR configuration and assemble them in a JavaScript file that you can then pass to
the CLI:

```
build
∟ index.js
∟ webpack.config.base.js
∟ webpack.config.client.js
∟ webpack.config.devServer.js
∟ webpack.config.server.js
package.json
```

the `index.js` could look like this

```js
const client = require('./webpack.config.client');
const server = require('./webpack.config.server');
const devServer = require('./webpack.config.devServer');

module.exports = { client, server, devServer };
```

Your `package.json` like this

```json
{
  "scripts": {
    "serve": "vussr serve --config ./config/index.js",
    "build": "vussr build --config ./config/index.js",
    "start": "vussr start --config ./config/index.js"
  }
}
```

## Using the CLI and the `--extend` parameter

```js
{
  "client": { /* a webpack configuration for the client */ },
  "server": { /* a webpack configuration for the server */ },
  "devServer": { /* a webpack configuration for the Webpack DevServer */ },
}
```

You can pass the path to this file as the `--extend` parameter. `client` and `server` should contain
individual [Webpack configurations](https://webpack.js.org/configuration/#options) (the thing you would usually pass to webpack). The `devServer` should be an object containing [the options you would pass as `devServer` to a regular Webpack configuration](https://webpack.js.org/configuration/dev-server/).

This individual configuration will then merge into the [built in Webpack configuration](https://github.com/spring-media/red-vussr/tree/master/lib/config) and extend this.

```
build
∟ index.js
∟ webpack.config.base.js
∟ webpack.config.client.js
∟ webpack.config.devServer.js
∟ webpack.config.server.js
package.json
```

the `index.js` could look like this

```js
const client = require('./webpack.config.client');
const server = require('./webpack.config.server');
const devServer = require('./webpack.config.devServer');

module.exports = { client, server, devServer };
```

Your `package.json` like this

```json
{
  "scripts": {
    "serve": "vussr serve --extend ./config/index.js",
    "build": "vussr build --extend ./config/index.js",
    "start": "vussr start --extend ./config/index.js"
  }
}
```

## Development / Tests

Clone this repository and run either

```console
npm test
npm test --watch
npm test --coverage
```

Also, you have the following commands

- `test:serve` runs `vussr serve` with a local test configuration
- `test:start` runs `vussr start` with a local test configuration
- `test:build` runs `vussr build` with a local test configuration

These commands can be useful if you want to create snapshots of the ouput created by the (dev) server
for your tests. It uses a configuration you can find in `test/__build__` to run an app you can find in `test/__app__`. These files are already being used to run tests for the dev and production server.
