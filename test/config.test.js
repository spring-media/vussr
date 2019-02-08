const Config = require('../src/config');
const defaultOptions = require('../src/udssr.config.default');
const webpackConfig = require('../webpack/index');

jest.mock('../webpack/index');

test('it uses the default options', async () => {
  const config = new Config();
  expect(config.config).toEqual(defaultOptions);
});

test('it uses the options passed to it', async () => {
  const options = { entryClient: 'src/foobar.js' };
  const expectedOptions = Object.assign({}, defaultOptions, options);
  const config = new Config(options);
  expect(config.config).toEqual(expectedOptions);
});

test('it returns the config as JSON', async () => {
  const config = new Config();
  const client = webpackConfig.client();
  const server = webpackConfig.server();
  const devServer = webpackConfig.devServer();
  const processedOptions = { client, server, devServer };
  const expectedOptions = Object.assign({}, defaultOptions, processedOptions);
  expect(config.getJson()).toEqual(expectedOptions);
});

test('it processes the webpack config with provided methods', async () => {
  const client = jest.fn().mockReturnValue({});
  const server = jest.fn().mockReturnValue({});
  const devServer = jest.fn().mockReturnValue({});
  const options = { client, server, devServer };
  const config = new Config(options);
  config.getWebpackConfig();
  expect(client).toHaveBeenCalledWith(webpackConfig.client());
  expect(server).toHaveBeenCalledWith(webpackConfig.server());
  expect(devServer).toHaveBeenCalledWith(webpackConfig.devServer());
});

test('it returns the webpack config if it is provided as object', async () => {
  const client = {};
  const server = {};
  const devServer = {};
  const options = { client, server, devServer };
  const config = new Config(options);
  const resultingWebpackConfig = config.getWebpackConfig();
  expect(resultingWebpackConfig).toEqual(options);
});
