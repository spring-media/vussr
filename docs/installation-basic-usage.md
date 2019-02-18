# Installation & Basic Usage

## Installation

Just install VUSSR via npm

```console
npm i vussr --save # yarn add vussr
```

## Run Commands

For the sake of readability here is a quick overview over the commands and parameters provided by
VUSSR.

```
$ vussr --help

Usage: vussr [options] [command]

Options:

  -v, --version          output the version number
  -n, --nock             start in nock mode (load recorded nocks)
  -r, --record           record external requests with nock (always use together with --nock)
  --nockPath [nockPath]  where external request records should go or be loaded from
  -h, --help             output usage information

Commands:

  build                  creates a production build
  start                  starts a formerly created build with the production server
  serve                  serves the app with hot reloading for development

```

👉 [For a more thorough guide please refer to Commands and Parameters](./commands-and-parameters.md)

## Setup your project

Your project needs to have two entry points. In classic, non-server-side-rendered Vue apps, you
often have one entry point which includes all other files of your project (implicitly or explicitly)
and Webpack creates a bundle based on that entry point. With Server Side Rendering you need two
bundles, one for your client and one for your server. Those bundles run the same app (your project)
but set them up in a different manner.

For the client you need to load your app and mount it to a DOM-element in your website. For the server
you prefetch some data, run your app, and render your whole app to a (HTML-)string that you send to the
user as your markup.

VUSSR, by default, expects those entry files to be placed in a `src` folder with the following filenames.
If that file structure isn't for you you can change this by setting up a configuration.

```
root
 ∟ src
    ∟ entry.client.js
    ∟ entry.server.js
```

👉 [Please refer to Configuration to learn how to change those paths](./configuration.md)

You can now add npm scripts to you package.json

```json
{
  "scripts": {
    "serve": "vussr serve",
    "build": "vussr build",
    "start": "vussr start"
  }
}
```

Since you will want to use the same app (your code) on the server as well as on the client, we recommend
you create an extra file that sets up your app and that is included by your `entry.client.js` and
`entry.server.js`:

**entry.main.js**

```js
import Vue from 'vue';
import App from './components/app.vue';

export default context => {
  const render = h => h(HelloWorld);
  return new Vue({ render });
};
```

**entry.client.js**

```js
import createApp from './entry.main';

const app = createApp();
app.$mount('#app');
```

**entry.server.js**

```js
import createApp from './entry.main';

export default context => {
  return createApp(context);
};
```

👉 [Please refer to this example app for a very basic setup](./example-app)

Given that there is a Vue component in `components/app.vue` you can now run

```console
npm run serve
```

and it should start your app using a Webpack DevServer. Use

```console
npm run build
npm run start
```

to create a production build and start a procution server (Express) with it.

## Further steps

Read more on:

- [Quick Start](../#quick-start)
- [Configuration](./configuration.md)
- [Nocks](./nocks.md)
- [Development and Testing](./development-and-testing.md)
