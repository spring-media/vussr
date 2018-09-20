const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const express = require('express');
const healthcheck = require('express-healthcheck');
const { createBundleRenderer } = require('vue-server-renderer')
const { getRenderOptions } = require('./renderer');
const { getConfig } = require('../utils/config');
const serveApp = require('./middleware');
const logger = require('./logger');

const DEFAULT_PORT = 8080;

class ProdServer {

  constructor(config) {
    this.port = DEFAULT_PORT;
    this.config = getConfig(config);
    this.server = express();
    this.renderer = this.getRenderer();
    this.server.use('/', express.static(this.config.server.output.path));
    this.server.use('/', express.static(this.config.client.output.path));
    this.server.use('/healthcheck', healthcheck());
    this.server.use(serveApp(url => promisify(this.renderer.renderToString.bind(this.renderer))({ url })));
  }

  async listen() {
    await promisify(this.server.listen.bind(this.server))(this.port);
    logger.info(`server listening on port ${this.port}`)
  }

  getRenderer() {
    const { serverBundle, clientManifest } = this.readBundleAndManifest();
    return createBundleRenderer(serverBundle, { ...getRenderOptions(), clientManifest });
  }

  readBundleAndManifest() {
    const serverBundlePath = path.resolve(this.config.server.output.path, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(this.config.client.output.path, 'vue-ssr-client-manifest.json');
    const serverBundle = JSON.parse(fs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(fs.readFileSync(clientManifestPath));
    return { serverBundle, clientManifest };
  }

}

module.exports = ProdServer;
