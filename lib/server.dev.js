const path = require('path');
const { promisify } = require('util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const chalk = require('chalk');
const { createBundleRenderer } = require('vue-server-renderer')
const { getConfig } = require('./utils/config');
const { getRenderOptions } = require('./renderer');
const serveApp = require('./middleware');
const logger = require('./logger');

const DEFAULT_PORT = 8080;

class DevServer {

  constructor(config) {
    this.config = getConfig(config);
    this.compiler = webpack([this.config.client, this.config.server]);
    this.devServer = new WebpackDevServer(this.compiler, { ...this.config.devServer, before: (app) => this.before(app) });
    this.clientFs = this.compiler.compilers[0].outputFileSystem;
    this.serverFs = this.compiler.compilers[1].outputFileSystem;
    this.render = this.listener = this.onCompileCb = this.port = null;
    this.compiler.hooks.done.tap('udssr', stats => this.doneHook(stats));
  }

  async listen() {
    this.port = await portfinder.getPortPromise({ port: this.config.devServer.port || DEFAULT_PORT });
    this.listener = await this.listenOnDevServer(this.port);
    return this;
  }

  onCompile(cb) {
    this.onCompileCb = cb;
  }

  close() {
    this.listener.close();
  }
  
  doneHook(stats) {
    if (stats.hasErrors()) return;
    this.render = this.getRenderFunction();
    this.logSuccessMessage(stats);
    if (this.onCompileCb) this.onCompileCb(stats);
  }

  getRenderFunction() {
    const serverBundlePath = path.resolve(this.config.server.output.path, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(this.config.client.output.path, 'vue-ssr-client-manifest.json');
    const templatePath = path.resolve(this.config.client.output.path, 'index.html');
    const serverBundle = JSON.parse(this.serverFs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(this.clientFs.readFileSync(clientManifestPath));
    const template = this.clientFs.readFileSync(templatePath, 'utf-8');
    const renderer = createBundleRenderer(serverBundle, { ...getRenderOptions(), template, clientManifest });
    return promisify(renderer.renderToString.bind(renderer));
  }

  before(app) {
    if (this.config.devServer.before) this.config.devServer.before(app);
    app.use(serveApp(context => this.render(context)));
  }

  logSuccessMessage(stats) {
    console.log('');
    console.log(chalk.green('  ✔ Server has been updated'));
    console.log('');
    console.log(chalk.dim('  - App running at '), `http://localhost:${this.port}`);
    console.log(chalk.dim('  - Example article'), `http://localhost:${this.port}/article/5b5996b98760980001ed8831`);
    console.log('');
  }

  listenOnDevServer(port) {
    return new Promise((res, rej) => { const listener = this.devServer.listen(port, '127.0.0.1', err => err ? rej(err) : res(listener))})
  }

}

module.exports = DevServer;
