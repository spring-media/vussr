![vuedssr logo](./docs/vussr-logo.svg)

# ✊ VUSSR

Development and Production Server Side Renderer for VUE

## About

VUSSR provides you with a Webpack DevServer for development and an Express Server for production to
render your VUE application on the server and hydrate it on the client. It comes with a command
line API to run your app

- [Quick Start](#quick-start) (This Guide)
- [Installation & Basic Usage](./docs/installation-basic-usage.md)
- [Configuration](./docs/configuration.md)
- [Nocks](./docs/nocks.md)
- [Development and Testing](./docs/development-and-testing.md)

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

```console
npm run serve
```

Simply run `npm run serve` to start your app on a development server (Webpack DevServer). It will
automatically recompile your code on file changes and serve them on
[http://127.0.0.1:8080](http://127.0.0.1:8080). You can configure the port and other Webpack
DevServer related options. See [Configuration](#configuration).

### Create a Production Build

```console
npm run build
```

To run your app in production you need to create a production build and then start your production
server with it. To create a production build run `npm run build`.

### Run the Produciton Server

```console
npm run start
```

Once you have created your production build your can start your production server with `npm run start`.

## Further steps

Read more on:

- [Installation & Basic Usage](./docs/installation-basic-usage.md)
- [Configuration](./docs/configuration.md)
- [Nocks](./docs/nocks.md)
- [Development and Testing](./docs/development-and-testing.md)

## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/LukasBombach">
          <img width="150" height="150" src="https://github.com/LukasBombach.png?v=3&s=150">
          </br>
          Lukas Bombach
        </a>
      </td>
    </tr>
  <tbody>
</table>
