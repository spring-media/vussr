const fs = require('fs');
const renderer = require('../lib/renderer');

jest.mock('fs');

test('provides render options', () => {
  const template = 'mock template';
  const runInNewContext = false;
  const publicPath = '/mocked/realpathSync/public';
  const expectedRenderOptions = { template, publicPath, runInNewContext };
  fs.readFileSync.mockImplementationOnce(() => template)
  expect(renderer.getRenderOptions()).toEqual(expectedRenderOptions);
})