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

You can now add npm script to you `package.json

```json
{
  "scripts": {
    "serve": "vussr serve",
    "build": "vussr build",
    "start": "vussr start"
  }
}
```
