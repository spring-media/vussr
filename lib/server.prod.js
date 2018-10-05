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
    this.server.use('/', express.static(this.config.server.output.path));
    this.server.use('/', express.static(this.config.client.output.path));
    this.server.use('/healthcheck', healthcheck());
    this.server.use(serveApp(this.getRenderFunction()));
  }

  async listen() {
    await promisify(this.server.listen.bind(this.server))(this.port);
    logger.info(`server listening on port ${this.port}`)
  }

  getRenderFunction() {
    const { serverBundle, clientManifest, template } = this.readBundleAndManifest();
    const renderer = createBundleRenderer(serverBundle, { ...getRenderOptions(), template, clientManifest });
    const renderToString = promisify(renderer.renderToString.bind(renderer));
    return context => renderToString(context);
  }

  readBundleAndManifest() {
    const serverBundlePath = path.resolve(this.config.server.output.path, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(this.config.client.output.path, 'vue-ssr-client-manifest.json');
    const templatePath = path.resolve(this.config.client.output.path, 'index.html');
    const serverBundle = JSON.parse(fs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(fs.readFileSync(clientManifestPath));
    const template = fs.readFileSync(templatePath, 'utf-8');
    return { serverBundle, clientManifest, template };
  }

}

module.exports = ProdServer;
