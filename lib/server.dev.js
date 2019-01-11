require('dotenv').config();
const path = require('path');
const { promisify } = require('util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const { createBundleRenderer } = require('vue-server-renderer');
const { getConfig } = require('./utils/config');
const getRenderOptions = require('./utils/renderer');
const { getRenderMiddleWares } = require('./middlewares');
const { applyMiddlewares: applyNockMiddlewares } = require('./nock');
const { listenAsPromised, closeAsPromised } = require('./utils/server');
const { logDevServerSuccessMessage, logDevServerFailedMessage } = require('./utils/messages');

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = '::';

class DevServer {
  constructor(options) {
    const after = app => this.after(app);
    this.config = getConfig(options);
    this.compiler = webpack([this.config.client, this.config.server]);
    this.devServer = new WebpackDevServer(this.compiler, { ...this.config.devServer, after });
    this.clientFs = this.compiler.compilers[0].outputFileSystem;
    this.serverFs = this.compiler.compilers[1].outputFileSystem;
    this.render = this.listener = this.port = this.host = null;
    this.onCompileCb = this.config.onCompile || (() => {});
    this.compiler.hooks.done.tap('udssr', stats => this.doneHook(stats));
  }

  async listen() {
    this.port = await portfinder.getPortPromise({ port: this.config.devServer.port || DEFAULT_PORT });
    this.host = (this.config.devServer && this.config.devServer.host) || DEFAULT_HOST;
    this.listener = await listenAsPromised(this.devServer, this.port, this.host);
    return this;
  }

  async close() {
    await closeAsPromised(this.listener)
  }

  doneHook(stats) {
    if (stats.hasErrors()) return logDevServerFailedMessage(stats);
    this.render = this.getRenderFunction();
    logDevServerSuccessMessage(this.port);
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

}

module.exports = DevServer;
