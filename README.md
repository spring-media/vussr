![vuedssr logo](./docs/vussr-logo.svg)

# ✊ VUSSR

Development and Production Server Side Renderer for VUE

## About

VUSSR provides you with a Webpack DevServer for development and an Express Server for production to
render your VUE application on the server and hydrate it on the client. It comes with a command
line API to run your app

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration](#configuration)
- [Nocks](#nocks)
- [Development and Testing](#development-and-testing)

## Quick Start

**Install VUSSR**

```console
npm i vussr --save # yarn add vussr
```

**Create Entry Points**

By default, VUSSR looks for 2 files as entry points, one for your client and one for your server:

```
root
 ∟ src
    ∟ entry.client.js
    ∟ entry.server.js
```

`entry.server.js` is the base file for your server. This file has to have a function as default export
that returns an instance of your Vue app.

`entry.client.js` is the base file for your client code. Any code that will be sent to and executed
in the client needs to be included or imported in the in this file. Usually, you will want to import
and mount your the same app that you used in your server entrypoint.

👉 [Please refer to this example app for a very basic setup](./docs/example-app)

**Add npm Scripts**

```json
{
  "scripts": {
    "serve": "vussr serve",
    "build": "vussr build",
    "start": "vussr start"
  }
}
```

**Develop Your App**

Simply run `npm run serve` to start your app on a development server (Webpack DevServer). It will
automatically recompile your code on file changes and serve them on
[http://127.0.0.1:8080](http://127.0.0.1:8080). You can configure the port and other Webpack
DevServer related options. See [Configuration](#configuration).

**Create a Production Build**

To run your app in production you need to create a production build and then start your production
server with it. To create a production build run `npm run build`.

**Run the Produciton Server**

Once you have created your production build your can start your production server with `npm run start`.

## Installation

Just install VUSSR via npm

```console
npm i vussr --save # yarn add vussr
```

## Basic Usage

VUSSR is a cli tool which means once you have installed it in your dependencies you can use it as a
command in your npm scripts. For an example, scroll up to **Add npm Scripts** under [Quick Start](#quick-start).

VUSSR has three commands: `serve`, `build` and `start`. `serve` and `start` can be run with the additional
parameters `--nock`, `--record` and `--nockPath`. You can run `build` with these parameters but they will have
no effect.

## Configuration

## Nocks

## Development and Testing
