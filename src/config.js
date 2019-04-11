const webpackConfig = require('../webpack');
const defaultConfig = require('./vussr.config.default');

class Config {

  constructor(config, cliOptions) {
    const nockOptions = this.getNockOptions(cliOptions);
    this.config = Object.assign({}, defaultConfig, config, nockOptions);
    this.config.isCDN = this.isUrl(this.config.assetsUrlPath);
    if(!this.config.isCDN) {
      this.config.assetsUrlPath = this.cleanRelativePath(this.config.assetsUrlPath);
    }
  }

  cleanRelativePath(val) {
    return val.replace(/^\/?/, '/').replace(/\/?$/, '/');
  }

  isUrl(string) {
    try {
      return Boolean(new URL(string));
    } catch (err) {
      return false;
    }
  }

  getJson() {
    return Object.assign({}, this.config, this.getWebpackConfig());
  }

  getNockOptions(cliOptions) {
    if (!cliOptions || !cliOptions.parent) return {};
    const { nock: replay, record, nockPath = '__requestNocks__' } = cliOptions.parent;
    const nock = record ? 'record' : replay ? 'replay' : false;
    return { nock, nockPath };
  }

  getWebpackConfig() {
    const config = this.config;
    const clientConfig = webpackConfig.client(config);
    const serverConfig = webpackConfig.server(config);
    const devServerConfig = webpackConfig.devServer(config);
    const client = this.callIfFunction(config.client, clientConfig);
    const server = this.callIfFunction(config.server, serverConfig);
    const devServer = this.callIfFunction(config.devServer, devServerConfig);
    return { client, server, devServer };
  }

  callIfFunction(option, ...args) {
    return typeof option === 'function' ? option(...args) : option;
  }
}

module.exports = Config;
