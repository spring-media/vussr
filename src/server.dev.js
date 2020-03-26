require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const { createBundleRenderer } = require('vue-server-renderer');
const gracefulShutdown = require('http-graceful-shutdown');
const logger = require('./logger');
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
  constructor(config, cliOptions) {
    this.config = new Config(config, cliOptions).getJson();
    this.compiler = webpack([this.config.client, this.config.server]);
    this.devServer = new WebpackDevServer(this.compiler, this.getDevServerConfig());
    this.clientFs = this.compiler.compilers[0].outputFileSystem;
    this.serverFs = this.compiler.compilers[1].outputFileSystem;
    this.render = this.listener = this.port = this.host = this.resolveFirstCompilation = null;
    this.firstCompilationPromise = new Promise(resolve => (this.resolveFirstCompilation = resolve));
    this.compiler.hooks.done.tap('vussr', stats => this.doneHook(stats));
  }

  async listen() {
    const desiredPort = this.config.devServer.port || DEFAULT_PORT;
    this.port = await portfinder.getPortPromise({ port: desiredPort });
    this.host = (this.config.devServer && this.config.devServer.host) || DEFAULT_HOST;
    this.listener = await listenAsPromised(this.devServer, this.port, this.host);
    gracefulShutdown(this.listener);
    await this.waitForFirstCompilation();
    return this;
  }

  async close() {
    await closeAsPromised(this.listener);
    return this;
  }

  doneHook(stats) {
    try {
      if (stats.hasErrors()) return logDevFail(stats);
      this.updateRenderFunction();
      this.resolveFirstCompilation();
      logDevSuccess(this.port);
    } catch (err) {
      logger.error(err);
    }
  }

  updateRenderFunction() {
    const outputPath = this.config.outputPath;
    const serverBundlePath = path.resolve(outputPath, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(outputPath, 'vue-ssr-client-manifest.json');
    const templatePath = path.resolve(outputPath, 'index.html');
    const serverBundle = JSON.parse(this.serverFs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(this.clientFs.readFileSync(clientManifestPath));
    const template = this.clientFs.readFileSync(templatePath, 'utf-8');
    const bundleOptions = { ...renderOptions, template, clientManifest };
    const renderer = createBundleRenderer(serverBundle, bundleOptions);
    this.render = context => renderer.renderToString(context);
  }

  getDevServerConfig() {
    const { devServer } = this.config;
    const before = app => this.before(app);
    const after = app => this.after(app);
    return { ...devServer, before, after };
  }

  before(app) {
    if (this.config.devServer.before) this.config.devServer.before(app);
    app.use(/^\/$/, ...this.getMiddleWares());
  }

  after(app) {
    if (this.config.devServer.after) this.config.devServer.after(app);
    app.use(...this.getMiddleWares());
    app.set('ETag', 'strong');
  }

  getMiddleWares() {
    const renderFn = context => this.render(context);
    const { before, after } = this.config.middleware;
    const nock = this.config.nock;
    const nockPath = this.config.nockPath;
    const accessLogs = this.config.accessLogs || 'development';
    return getMiddleWares({ renderFn, before, after, nock, nockPath, accessLogs });
  }

  waitForFirstCompilation() {
    return this.firstCompilationPromise;
  }
}

module.exports = DevServer;
