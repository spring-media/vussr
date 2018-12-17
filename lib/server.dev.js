require('dotenv').config();
const path = require('path');
const { promisify } = require('util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const chalk = require('chalk');
const { createBundleRenderer } = require('vue-server-renderer');
const { getConfig } = require('./utils/config');
const getRenderOptions = require('./config/renderer');
const { getRenderMiddleWares } = require('./middlewares');
const { applyMiddlewares: applyNockMiddlewares } = require('./nock');

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = '0.0.0.0';

class DevServer {
  constructor(options) {
    this.config = getConfig(options);
    const after = app => this.after(app);
    this.compiler = webpack([this.config.client, this.config.server]);
    this.devServer = new WebpackDevServer(this.compiler, { ...this.config.devServer, after });
    this.clientFs = this.compiler.compilers[0].outputFileSystem;
    this.serverFs = this.compiler.compilers[1].outputFileSystem;
    this.render = this.listener = this.port = null;
    this.onCompileCb = this.config.onCompile || (() => {});
    this.compiler.hooks.done.tap('udssr', stats => this.doneHook(stats));
  }

  async listen() {
    const port = this.config.devServer.port || DEFAULT_PORT;
    this.port = await portfinder.getPortPromise({ port });
    this.listener = await this.listenOnDevServer(this.port);
    return this;
  }

  onCompile(cb) {
    this.onCompileCb = cb;
  }

  close() {
    return new Promise((resolve, reject) => this.listener.close(err => err ? reject(err) : resolve()));
  }

  doneHook(stats) {
    if (stats.hasErrors()) return this.logFailedMessage(stats);
    this.render = this.getRenderFunction();
    this.logSuccessMessage(stats);
    this.onCompileCb(stats);
  }

  getRenderFunction() {
    const serverOutputPath = this.config.server.output.path;
    const clientOutputPath = this.config.client.output.path;
    const serverBundlePath = path.resolve(serverOutputPath, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(clientOutputPath, 'vue-ssr-client-manifest.json');
    const templatePath = path.resolve(this.config.client.output.path, 'index.html');
    const serverBundle = JSON.parse(this.serverFs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(this.clientFs.readFileSync(clientManifestPath));
    const template = this.clientFs.readFileSync(templatePath, 'utf-8');
    const bundleOptions = { ...getRenderOptions(), template, clientManifest };
    const renderer = createBundleRenderer(serverBundle, bundleOptions);
    return promisify(renderer.renderToString.bind(renderer));
  }

  after(app) {
    if (this.config.devServer.after) this.config.devServer.after(app);
    const middlewares = this.config.middlewares || {};

    if (this.config.nock) {
      applyNockMiddlewares(middlewares, this.config.record, this.config.nockPath);
    }

    const renderFn = context => this.render(context);
    app.use(...getRenderMiddleWares({
      renderFn,
      before: middlewares.before,
      after: middlewares.after,
    }));
  }

  logSuccessMessage(stats) {
    console.log('');
    console.log(chalk.green('  ✔ Server has been updated'));
    console.log('');
    console.log(chalk.dim('  - App running at '), `http://localhost:${this.port}`);
    console.log(
      chalk.dim('  - Example article'),
      `http://localhost:${this.port}/article/5b5996b98760980001ed8831`
    );
    console.log('');
  }

  logFailedMessage(stats) {
    console.log('');
    console.log(chalk.red('  x Compilation has failed'));
    stats.errors.forEach(err => console.log(`\n\n  - ${err}`));
    console.log('');
  }

  listenOnDevServer(port) {
    const host = (this.config.devServer && this.config.devServer.host) || DEFAULT_HOST;
    return new Promise((res, rej) => {
      const listener = this.devServer.listen(port, host, err =>
        err ? rej(err) : res(listener)
      );
    });
  }
}

module.exports = DevServer;
