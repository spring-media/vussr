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

### Install VUSSR

```console
npm i vussr --save # yarn add vussr
```

### Create Entry Points

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

### Add npm Scripts

```json
{
  "scripts": {
    "serve": "vussr serve",
    "build": "vussr build",
    "start": "vussr start"
  }
}
```

### Develop Your App

Simply run `npm run serve` to start your app on a development server (Webpack DevServer). It will
automatically recompile your code on file changes and serve them on
[http://127.0.0.1:8080](http://127.0.0.1:8080). You can configure the port and other Webpack
DevServer related options. See [Configuration](#configuration).

### Create a Production Build

To run your app in production you need to create a production build and then start your production
server with it. To create a production build run `npm run build`.

### Run the Produciton Server

Once you have created your production build your can start your production server with `npm run start`.

## Installation

Just install VUSSR via npm

```console
npm i vussr --save # yarn add vussr
```

## Basic Usage

VUSSR is a cli tool which means once you have installed it in your dependencies you can use it as a
command in your npm scripts. For an example, scroll up to [Add npm Scripts](#add-npm-scripts).

VUSSR has three commands:

| Command | Description                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------- |
| `serve` | This will start your application using a Webpack DevServer and recompile your code on file changes |
| `build` | This will create a production build that you can use with the start command to run your app        |
| `start` | This will take a production build and run it with an Express server                                |

`serve` and `start` can be run with the additional _nock_ parameters. With these parameters, you can record
requests and responses made on the server side and replay those requests later so you can work when you're
offline or a service you depend on is offline

- `--nock` This will start your server in nock mode, meaning requests made by the server will be
  answered locally by previously recorded requests of the same kind
- `--nock --record` This will record all requests made on the server side and store them to JSON files so
  you can replay them later with the nock command.
- `--nockPath[nockPath]` You can add this parameter to `--nock` and `--nock --record` to provide a path to
  where the nocked data should be read from and written to.

You can run `build` with these parameters but they will have no effect.

👉 [For an example on how to use `nock` please refer to this example](./docs/nock.md)

## Configuration

## Nocks

## Development and Testing
