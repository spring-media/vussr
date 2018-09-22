const webpack = require('webpack');
const { getConfig } = require('../utils/config');
const Compiler = require('../lib/compiler');

jest.mock('webpack');
jest.mock('../utils/config');

beforeEach(() => {
  webpack.mockClear();
  getConfig.mockClear();
});

test('sets up the compiler', () => {
  const config = { client: 'client', server: 'server' };
  const compiler = new Compiler(config);
  expect(webpack).toHaveBeenCalledWith([config.client, config.server]);
  expect(compiler.config).toBe(config);
  expect(compiler.compiler).toBe(webpack.instance);
});
