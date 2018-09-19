const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const portfinder = require('portfinder');
const WebpackDevServer = require('webpack-dev-server');
const { createBundleRenderer } = require('vue-server-renderer')
const client = require('../build/webpack.config.client');
const server = require('../build/webpack.config.server');
const devServer = require('../build/webpack.config.server.dev');
const serveApp = require('./middleware');
const logger = require('./logger');

const DEFAULT_PORT = 8080;
const DONE_TAP_NAME = 'udssr';
const defaultConfig = { client, server, devServer };

const publicPath = path.resolve(__dirname, '..', '..', '..', 'services', 'red-delivery', 'public');
const templatePath = path.resolve(publicPath, 'index.html');
const template = fs.readFileSync(templatePath, 'utf-8');

const defaultRendererOptions = {
  runInNewContext: false,
  template,
  publicPath
}

portfinder.basePort = devServer.port || DEFAULT_PORT;

class DevServer {

  constructor(config = defaultConfig) {
    this.config = config;
    this.compiler = webpack([config.client, config.server]);
    this.devServer = new WebpackDevServer(this.compiler, this.getWebpackDevServerConfig());
    this.clientFs = this.compiler.compilers[0].outputFileSystem;
    this.serverFs = this.compiler.compilers[1].outputFileSystem;
    this.serverBundlePath = path.join(config.server.output.path, 'vue-ssr-server-bundle.json');
    this.clientManifestPath = path.join(config.client.output.path, 'vue-ssr-client-manifest.json');
    this.rendererOptions = Object.assign({}, defaultRendererOptions);
    this.renderer = null;
    this.compiler.hooks.done.tap(DONE_TAP_NAME, stats => this.webpackCompilerDoneHook(stats));
    this.port = portfinder.basePort;
  }

  async listen() {
    try {
      this.port = await portfinder.getPortPromise()
      await this.startWebpackDevServerAsPromised(this.port);
      logger.info(`Server listening on http://localhost:${this.port}`)
    } catch (err) {
      logger.error(err);
    }
  }

  async webpackCompilerDoneHook(stats) {
    try {
      const { errors, warnings } = stats.toJson();
      const clientManifest = JSON.parse(this.clientFs.readFileSync(this.clientManifestPath));
      const serverBundle = JSON.parse(this.serverFs.readFileSync(this.serverBundlePath));
      errors.forEach(err => logger.error(err));
      warnings.forEach(err => logger.warn(err));
      if (!errors.length) this.renderer = createBundleRenderer(serverBundle, { ...this.rendererOptions, clientManifest });
    } catch (err) {
      logger.error(err);
    }
  }

  webpackDevServerBefore(app) {
    if (this.config.devServer.before) this.config.devServer.before(app);
    app.use(serveApp(url => this.render(url)));
  }

  render(url) {
    return new Promise((resolve, reject) => this.renderer.renderToString({ url }, (err, html) => err ? reject(err) : resolve(html)));
  }

  getWebpackDevServerConfig() {
    return { ...this.config.devServer, before: (app) => this.webpackDevServerBefore(app) }
  }

  startWebpackDevServerAsPromised(port) {
    return new Promise((resolve, reject) => this.devServer.listen(port, err => err ? reject(err) : resolve()));
  }

}

module.exports = DevServer;



