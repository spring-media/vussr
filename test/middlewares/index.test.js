const { getRenderMiddleWares } = require('../../lib/middlewares');
const setContext = require('../../lib/middlewares/setContext');
const runApp = require('../../lib/middlewares/runApp');
const sendHtml = require('../../lib/middlewares/sendHtml');
const errorHandler = require('../../lib/middlewares/errorHandler');

jest.mock('../../lib/middlewares/setContext');
jest.mock('../../lib/middlewares/runApp');
jest.mock('../../lib/middlewares/sendHtml');
jest.mock('../../lib/middlewares/errorHandler');

test('returns middlewares in the correct order', async () => {
  const before = [jest.fn()];
  const after = [jest.fn()];
  const renderFn = jest.fn();
  const expectedArray = [setContext(), ...before, runApp(renderFn), ...after, sendHtml(), errorHandler()];
  expect(getRenderMiddleWares({ before, after, renderFn })).toEqual(expectedArray)
});

test('handles undefined middlewares', async () => {
  const renderFn = jest.fn();
  const expectedArray = [setContext(), runApp(renderFn), sendHtml(), errorHandler()];
  expect(getRenderMiddleWares({ renderFn })).toEqual(expectedArray)
});
