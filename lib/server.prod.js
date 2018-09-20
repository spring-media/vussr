const fs = require('fs');
const path = require('path');
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer')
const serveApp = require('./middleware');
const clientConfig = require('../build/webpack.config.client');
const serverConfig = require('../build/webpack.config.server');
const logger = require('./logger');
const { appHtml, appPublic } = require('../utils/paths');

const DEFAULT_PORT = 8080;
const serverBundlePath = path.resolve(serverConfig.output.path, 'vue-ssr-server-bundle.json');
const clientManifestPath = path.resolve(clientConfig.output.path, 'vue-ssr-client-manifest.json');

const defaultRendererOptions = {
  template: fs.readFileSync(appHtml, 'utf-8'),
  publicPath: appPublic,
  runInNewContext: false,
}

class ProdServer {

  constructor() {
    const { serverBundle, clientManifest } = this.readBundleAndManifest();
    this.port = DEFAULT_PORT;
    this.server = express();
    this.rendererOptions = Object.assign({}, defaultRendererOptions);
    this.renderer = createBundleRenderer(serverBundle, { ...this.rendererOptions, clientManifest });
    this.server.use('/', express.static(serverConfig.output.path));
    this.server.use('/', express.static(clientConfig.output.path));
    this.server.use(serveApp(url => this.render(url)));
  }

  async listen() {
    await this.startExpressServerAsPromised(this.port);
    logger.info(`Production server listening on :${this.port}`)
  }

  readBundleAndManifest() {
    if(!fs.existsSync(serverBundlePath)) throw new Error(`Cannot find server bundle at ${serverBundlePath}`);
    if(!fs.existsSync(clientManifestPath)) throw new Error(`Cannot find client manifest at ${clientManifestPath}`);
    const serverBundle = JSON.parse(fs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(fs.readFileSync(clientManifestPath));
    return { serverBundle, clientManifest };
  }

  render(url) {
    return new Promise((resolve, reject) => this.renderer.renderToString({ url }, (err, html) => err ? reject(err) : resolve(html)));
  }

  startExpressServerAsPromised(port) {
    return new Promise((resolve, reject) => this.server.listen(port, err => err ? reject(err) : resolve()));
  }

}

module.exports = ProdServer;
