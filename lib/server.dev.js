const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const portfinder = require('portfinder');
const WebpackDevServer = require('webpack-dev-server');
const { createBundleRenderer } = require('vue-server-renderer')
const serveApp = require('./middleware');
const logger = require('./logger');
const { getConfig } = require('../utils/config');
const { appHtml, appPublic } = require('../utils/paths');

const DEFAULT_PORT = 8080;
const DONE_TAP_NAME = 'udssr';

const defaultRendererOptions = {
  template: fs.readFileSync(appHtml, 'utf-8'),
  publicPath: appPublic,
  runInNewContext: false,
}

class DevServer {

  constructor(config) {
    this.config = getConfig(config);
    this.compiler = webpack([this.config.client, this.config.server]);
    this.devServer = new WebpackDevServer(this.compiler, this.getWebpackDevServerConfig());
    this.clientFs = this.compiler.compilers[0].outputFileSystem;
    this.serverFs = this.compiler.compilers[1].outputFileSystem;
    this.serverBundlePath = path.join(this.config.server.output.path, 'vue-ssr-server-bundle.json');
    this.clientManifestPath = path.join(this.config.client.output.path, 'vue-ssr-client-manifest.json');
    this.rendererOptions = Object.assign({}, defaultRendererOptions);
    this.renderer = null;
    this.port = null;
    this.compiler.hooks.done.tap(DONE_TAP_NAME, stats => this.webpackCompilerDoneHook(stats));
  }

  async listen() {
    try {
      this.port = await portfinder.getPortPromise({ port: this.config.devServer.port || DEFAULT_PORT })
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

  startWebpackDevServerAsPromised(port) {
    return new Promise((resolve, reject) => this.devServer.listen(port, err => err ? reject(err) : resolve()));
  }

  getWebpackDevServerConfig() {
    return { ...this.config.devServer, before: (app) => this.webpackDevServerBefore(app) }
  }

}

module.exports = DevServer;



