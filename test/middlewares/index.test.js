const { getRenderMiddleWares } = require('../../lib/middlewares');
const writeAccessLogs = require('../../lib/middlewares/writeAccessLogs');
const setContext = require('../../lib/middlewares/setContext');
const runApp = require('../../lib/middlewares/runApp');
const sendHtml = require('../../lib/middlewares/sendHtml');
const errorHandler = require('../../lib/middlewares/errorHandler');

jest.mock('../../lib/middlewares/writeAccessLogs');
jest.mock('../../lib/middlewares/setContext');
jest.mock('../../lib/middlewares/runApp');
jest.mock('../../lib/middlewares/sendHtml');
jest.mock('../../lib/middlewares/errorHandler');

describe('middlewares', () => {

  test('returns middlewares in the correct order', async () => {
    const before = [jest.fn()];
    const after = [jest.fn()];
    const renderFn = jest.fn();
    const accessLogs = true;
    const expectedArray = [writeAccessLogs(), setContext(), ...before, runApp(renderFn), ...after, sendHtml(), errorHandler()];
    expect(getRenderMiddleWares({ before, after, renderFn, accessLogs })).toEqual(expectedArray)
  });

  test('handles undefined middlewares', async () => {
    const renderFn = jest.fn();
    const accessLogs = true;
    const expectedArray = [writeAccessLogs(), setContext(), runApp(renderFn), sendHtml(), errorHandler()];
    expect(getRenderMiddleWares({ renderFn, accessLogs })).toEqual(expectedArray)
  });

})
