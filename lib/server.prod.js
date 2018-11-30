const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const express = require('express');
const healthcheck = require('express-healthcheck');
const { createBundleRenderer } = require('vue-server-renderer');
const { getConfig } = require('./utils/config');
const getRenderOptions = require('./config/renderer');
const { getRenderMiddleWares } = require('./middlewares');
const logger = require('./logger');

const DEFAULT_PORT = 8080;

class ProdServer {
  constructor(options) {
    this.port = DEFAULT_PORT;
    this.listener = null;
    this.config = getConfig(options);
    this.app = this.setupApp();
  }

  async listen() {
    this.listener = await this.listenOnExpress(this.port);
    logger.info(`server listening on port ${this.port}`);
    return this;
  }

  close() {
    this.listener.close();
  }

  setupApp() {
    const app = express();
    const serverPublicPath = this.config.server.output.publicPath;
    const clientPublicPath = this.config.client.output.publicPath;
    const serverOutputPath = this.config.server.output.path;
    const clientOutputPath = this.config.client.output.path;
    const { before, after } = this.config.middlewares;
    const renderFn = this.getRenderFunction();
    app.use('/healthcheck', healthcheck());
    app.use(serverPublicPath, app.static(serverOutputPath));
    app.use(clientPublicPath, app.static(clientOutputPath));
    app.use(...getRenderMiddleWares({ renderFn, before, after }));
    return app;
  }

  getRenderFunction() {
    const { serverBundle, clientManifest, template } = this.readBundleAndManifest();
    const renderer = createBundleRenderer(serverBundle, {
      ...getRenderOptions(),
      template,
      clientManifest,
    });
    const renderToString = promisify(renderer.renderToString.bind(renderer));
    return context => renderToString(context);
  }

  readBundleAndManifest() {
    const serverBundlePath = path.resolve(
      this.config.server.output.path,
      'vue-ssr-server-bundle.json'
    );
    const clientManifestPath = path.resolve(
      this.config.client.output.path,
      'vue-ssr-client-manifest.json'
    );
    const templatePath = path.resolve(this.config.client.output.path, 'index.html');
    const serverBundle = JSON.parse(fs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(fs.readFileSync(clientManifestPath));
    const template = fs.readFileSync(templatePath, 'utf-8');
    return { serverBundle, clientManifest, template };
  }

  listenOnExpress(port) {
    return new Promise((res, rej) => {
      const listener = this.app.listen(port, err => (err ? rej(err) : res(listener)));
    });
  }
}

module.exports = ProdServer;
