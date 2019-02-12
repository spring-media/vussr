# Installation & Basic Usage

Just install VUSSR via npm

```console
npm i vussr --save # yarn add vussr
```

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

| Command                 | Description                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--nock`                | This will start your server in nock mode, meaning requests made by the server will be,answered locally by previously recorded requests of the same kind |
| `--nock --record`       | This will record all requests made on the server side and store them to JSON files so,you can replay them later with the nock command                   |
| `--nockPath [nockPath]` | You can add this parameter to `--nock` and `--nock --record` to provide a path to,where the nocked data should be read from and written to              |

You can run `build` with these parameters but they will have no effect.

👉 [For an example on how to use `nock` please refer to this example](./nocks.md)
