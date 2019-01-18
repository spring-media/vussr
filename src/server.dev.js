require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const { createBundleRenderer } = require('vue-server-renderer');
const gracefulShutdown = require('http-graceful-shutdown');
const Config = require('./config');
const getMiddleWares = require('./middlewares');
const { listenAsPromised, closeAsPromised } = require('./utils/server');
const { logDevSuccess, logDevFail } = require('./utils/messages');

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = '::';

const renderOptions = {
  runInNewContext: false,
};

class DevServer {
  constructor(options) {
    this.config = new Config(options).getJson();
    this.compiler = webpack([this.config.client, this.config.server]);
    this.devServer = new WebpackDevServer(this.compiler, this.getDevServerConfig());
    this.clientFs = this.compiler.compilers[0].outputFileSystem;
    this.serverFs = this.compiler.compilers[1].outputFileSystem;
    this.render = this.listener = this.port = this.host = null;
    this.onCompileCb = this.config.onCompile || (() => {});
    this.compiler.hooks.done.tap('udssr', stats => this.doneHook(stats));
  }

  async listen() {
    const desiredPort = this.config.devServer.port || DEFAULT_PORT;
    this.port = await portfinder.getPortPromise({ port: desiredPort });
    this.host = (this.config.devServer && this.config.devServer.host) || DEFAULT_HOST;
    this.listener = await listenAsPromised(this.devServer, this.port, this.host);
    gracefulShutdown(this.listener);
    return this;
  }

  async close() {
    await closeAsPromised(this.listener);
    return this;
  }

  doneHook(stats) {
    if (stats.hasErrors()) return logDevFail(stats);
    this.updateRenderFunction();
    this.onCompileCb(stats);
    logDevSuccess(this.port);
  }

  updateRenderFunction() {
    const serverOutputPath = this.config.server.output.path;
    const clientOutputPath = this.config.client.output.path;
    const serverBundlePath = path.resolve(serverOutputPath, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(clientOutputPath, 'vue-ssr-client-manifest.json');
    const templatePath = path.resolve(this.config.client.output.path, 'index.html');
    const serverBundle = JSON.parse(this.serverFs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(this.clientFs.readFileSync(clientManifestPath));
    const template = this.clientFs.readFileSync(templatePath, 'utf-8');
    const bundleOptions = { ...renderOptions, template, clientManifest };
    const renderer = createBundleRenderer(serverBundle, bundleOptions);
    this.render = context => renderer.renderToString(context);
  }

  after(app) {
    if (this.config.devServer.after) this.config.devServer.after(app);
    const renderFn = context => this.render(context);
    const { before, after } = this.config.middleware;
    const nock = this.config.nock;
    const options = { nockPath: this.config.nockPath };
    app.use(...getMiddleWares({ renderFn, before, after, nock, options }));
  }

  getDevServerConfig() {
    const { devServer } = this.config;
    const after = app => this.after(app);
    return { ...devServer, after };
  }
}

module.exports = DevServer;