require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const healthcheck = require('express-healthcheck');
const gracefulShutdown = require('http-graceful-shutdown');
const { createBundleRenderer } = require('vue-server-renderer');
const { listenAsPromised, closeAsPromised } = require('./utils/server');
const Config = require('./config');
const getMiddleWares = require('./middlewares');
const logger = require('./logger');

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = '::';

const renderOptions = {
  runInNewContext: false,
};

class ProdServer {
  constructor(config, cliOptions) {
    this.config = new Config(config, cliOptions).getJson();
    this.port = this.config.port || DEFAULT_PORT;
    this.host = this.config.host || DEFAULT_HOST;
    this.app = this.setupApp();
    this.listener = null;
  }

  async listen() {
    this.listener = await listenAsPromised(this.app, this.port, this.host);
    logger.info(`server listening on port ${this.host}:${this.port}`);
    gracefulShutdown(this.listener);
    return this;
  }

  async close() {
    await closeAsPromised(this.listener);
    return this;
  }

  setupApp() {
    const app = express();
    const { before, after } = this.config.middleware;
    const nock = this.config.nock;
    const nockPath = this.config.nockPath;
    const accessLogs = this.config.accessLogs || 'clf';
    const renderFn = this.getRenderFunction();
    if (!this.config.isCDN) {
      const serverPublicPath = this.config.server.output.publicPath;
      const clientPublicPath = this.config.client.output.publicPath;
      const serverOutputPath = this.config.server.output.path;
      const clientOutputPath = this.config.client.output.path;
      app.use(serverPublicPath, express.static(serverOutputPath));
      app.use(clientPublicPath, express.static(clientOutputPath));
    }
    app.use('/healthcheck', healthcheck());
    app.use(...getMiddleWares({ renderFn, before, after, nock, nockPath, accessLogs }));
    return app;
  }

  getRenderFunction() {
    const { serverBundle, clientManifest, template } = this.readBundleAndManifest();
    const bundleOptions = { ...renderOptions, template, clientManifest };
    const renderer = createBundleRenderer(serverBundle, bundleOptions);
    return context => renderer.renderToString(context);
  }

  readBundleAndManifest() {
    const outputPath = this.config.outputPath;
    const serverBundlePath = path.resolve(outputPath, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(outputPath, 'vue-ssr-client-manifest.json');
    const templatePath = path.resolve(outputPath, 'index.html');
    const serverBundle = JSON.parse(fs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(fs.readFileSync(clientManifestPath));
    const template = fs.readFileSync(templatePath, 'utf-8');
    return { serverBundle, clientManifest, template };
  }
}

module.exports = ProdServer;
