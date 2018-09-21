const path = require('path');
const { promisify } = require('util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const chalk = require('chalk');
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
    this.render = this.port = null;
    this.compiler.hooks.done.tap('udssr', stats => this.doneHook(stats));
  }

  async listen() {
    this.port = await portfinder.getPortPromise({ port: this.config.devServer.port || DEFAULT_PORT });
    await promisify(this.devServer.listen.bind(this.devServer))(this.port);
    logger.info(`development server listening on http://localhost:${this.port}`);
  }
  
  doneHook(stats) {
    if (!stats.hasErrors()) this.render = this.getRenderFunction();
    this.logSuccessMessage(stats);
  }

  getRenderFunction() {
    const serverBundlePath = path.resolve(this.config.server.output.path, 'vue-ssr-server-bundle.json');
    const clientManifestPath = path.resolve(this.config.client.output.path, 'vue-ssr-client-manifest.json');
    const templatePath = path.resolve(this.config.client.output.path, 'index.html');
    const serverBundle = JSON.parse(this.serverFs.readFileSync(serverBundlePath));
    const clientManifest = JSON.parse(this.clientFs.readFileSync(clientManifestPath));
    const template = this.clientFs.readFileSync(templatePath, 'utf-8');
    const renderer = createBundleRenderer(serverBundle, { ...getRenderOptions(), template, clientManifest });
    return promisify(renderer.renderToString.bind(renderer));
  }

  before(app) {
    if (this.config.devServer.before) this.config.devServer.before(app);
    app.use(serveApp(url => this.render({ url })));
  }

  logSuccessMessage(stats) {
    const buildTimeInSeconds = (stats.toJson().children.map(({time}) => time).reduce((sum, time) => sum + time , 0) / 1000 / 60 * 10).toFixed(2);
    console.log(chalk.green('  ✔ Server has been updated'), chalk.dim(`build time ${buildTimeInSeconds}s`));
    console.log('');
    console.log(chalk.dim('  - App running at '), `http://localhost:${this.port}`);
    console.log(chalk.dim('  - Example article'), `http://localhost:${this.port}/article/5b5996b98760980001ed8831`);
    console.log('');
  }

}

module.exports = DevServer;
