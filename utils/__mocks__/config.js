const defaultConfig = {
  client: 'defaultClientConfig',
  server: 'defaultServerConfig',
  devServer: 'defaultDevServerConfig',
};

const getConfig = jest.fn(config => config ? config : defaultConfig);
getConfig.defaultConfig = defaultConfig;

module.exports = {
  getConfig,
}