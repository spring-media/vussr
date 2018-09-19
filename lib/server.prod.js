const fs = require('fs');
const path = require('path');
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer')
const serveApp = require('./middleware');
const clientConfig = require('../build/webpack.config.client');
const serverConfig = require('../build/webpack.config.server');
const logger = require('./logger');

const DEFAULT_PORT = 8080;

const serverBundlePath = path.join(serverConfig.output.path, 'vue-ssr-server-bundle.json');
const clientManifestPath = path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json');

const publicPath = path.resolve(__dirname, '..', '..', '..', 'services', 'red-delivery', 'public');
const templatePath = path.resolve(publicPath, 'index.html');
const template = fs.readFileSync(templatePath, 'utf-8');

const defaultRendererOptions = {
  runInNewContext: false,
  template,
  publicPath
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
