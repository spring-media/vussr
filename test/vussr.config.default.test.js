const defaultConfig = require('../src/vussr.config.default');

test('matches the expected config', () => {
  const expectedConfig = {
    entryClient: expect.stringMatching(/src\/entry\.client\.js$/),
    entryServer: expect.stringMatching(/src\/entry\.server\.js$/),
    template: expect.stringMatching(/public\/index\.html$/),
    outputPath: expect.stringMatching(/dist$/),
    assetsPath: expect.stringMatching(/dist\/assets$/),
    filename: '[name].[chunkhash].js',
    middleware: { before: [], after: [] },
    compressHTML: false,
    compressAssets: false,  
    copy: [],
    server: expect.any(Function),
    client: expect.any(Function),
    devServer: expect.any(Function),
  };
  expect(defaultConfig).toEqual(defaultConfig);
});

test('has proper deffault values for client, server, devServer', () => {
  const value = { foo: 'bar' };
  expect(defaultConfig.server(value)).toBe(value);
  expect(defaultConfig.client(value)).toBe(value);
  expect(defaultConfig.devServer(value)).toBe(value);
});
