const fs = require('fs');
const getRenderOptions = require('../lib/config/renderer');

jest.mock('fs');

test('provides render options', () => {
  const runInNewContext = false;
  const publicPath = '/mocked/realpathSync/public';
  const expectedRenderOptions = { publicPath, runInNewContext };
  fs.readFileSync.mockImplementationOnce(() => template)
  expect(getRenderOptions()).toEqual(expectedRenderOptions);
})