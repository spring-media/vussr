const fs = require('fs');
const renderer = require('../lib/renderer');

jest.mock('fs');

test('provides render options', () => {
  const runInNewContext = false;
  const publicPath = '/mocked/realpathSync/public';
  const expectedRenderOptions = { publicPath, runInNewContext };
  fs.readFileSync.mockImplementationOnce(() => template)
  expect(renderer.getRenderOptions()).toEqual(expectedRenderOptions);
})