require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const express = require('express');
const healthcheck = require('express-healthcheck');
const { createBundleRenderer } = require('vue-server-renderer');
const gracefulShutdown = require('http-graceful-shutdown');
const { getConfig } = require('./utils/config');
const getRenderOptions = require('./utils/renderer');
const { listenAsPromised, closeAsPromised } = require('./utils/server');
const getMiddleWares = require('./middlewares');
const logger = require('./logger');

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = '::';

class ProdServer {
  constructor(options) {
    this.config = getConfig(options);
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
    const serverPublicPath = this.config.server.output.publicPath;
    const clientPublicPath = this.config.client.output.publicPath;
    const serverOutputPath = this.config.server.output.path;
    const clientOutputPath = this.config.client.output.path;
    const nock = this.config.nock;
    const options = { nockPath: this.config.nockPath }
    const { before, after } = this.config.middlewares ;
    const renderFn = this.getRenderFunction();
    app.use('/healthcheck', healthcheck());
    app.use(serverPublicPath, express.static(serverOutputPath));
    app.use(clientPublicPath, express.static(clientOutputPath));
    app.use(...getMiddleWares({ renderFn, before, after, nock, options }));
    return app;
  }

  getRenderFunction() {
    const { serverBundle, clientManifest, template } = this.readBundleAndManifest();
    const bundleOptions = { ...getRenderOptions(), template, clientManifest };
    const renderer = createBundleRenderer(serverBundle, bundleOptions);
    const renderToString = promisify(renderer.renderToString.bind(renderer));
    return context => renderToString(context);
  }

  readBundleAndManifest() {
    const serverOutputPath = this.config.server.output.path;
    const clientOutputPath = this.config.client.output.path;
    const serverBundlePath = path.resolve(serverOutputPath, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(clientOutputPath, 'vue-ssr-client-manifest.json');
    const templatePath = path.resolve(this.config.client.output.path, 'index.html');
    const serverBundle = JSON.parse(fs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(fs.readFileSync(clientManifestPath));
    const template = fs.readFileSync(templatePath, 'utf-8');
    return { serverBundle, clientManifest, template };
  }
}

module.exports = ProdServer;
