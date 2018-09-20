const path = require('path');
const { promisify } = require('util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const { createBundleRenderer } = require('vue-server-renderer')
const { getRenderOptions } = require('./renderer');
const { getConfig } = require('../utils/config');
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
    this.renderer = this.port = null;
    this.compiler.hooks.done.tap('udssr', stats => this.buildRenderer(stats));
  }

  async listen() {
    this.port = await portfinder.getPortPromise({ port: this.config.devServer.port || DEFAULT_PORT })
    await promisify(this.devServer.listen.bind(this.devServer))(this.port)
    logger.info(`development server listening on http://localhost:${this.port}`)
  }

  buildRenderer(stats) {
    const { errors, warnings } = stats.toJson();
    const serverBundlePath = path.resolve(this.config.server.output.path, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(this.config.client.output.path, 'vue-ssr-client-manifest.json');
    const templatePath = path.resolve(this.config.client.output.path, 'index.html');
    const serverBundle = JSON.parse(this.serverFs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(this.clientFs.readFileSync(clientManifestPath));
    const template = this.clientFs.readFileSync(templatePath, 'utf-8');
    errors.forEach(err => logger.error(err));
    warnings.forEach(err => logger.warn(err));
    if (!errors.length) this.renderer = createBundleRenderer(serverBundle, { ...getRenderOptions(), template, clientManifest });
  }

  before(app) {
    if (this.config.devServer.before) this.config.devServer.before(app);
    app.use(serveApp(url => promisify(this.renderer.renderToString.bind(this.renderer))({ url })));
  }

}

module.exports = DevServer;
