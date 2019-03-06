const morgan = require('morgan');
const getMiddleWares = require('../../src/middlewares');
const setContext = require('../../src/middlewares/setContext');
const applyNocks = require('../../src/middlewares/nock');
const runApp = require('../../src/middlewares/runApp');
const sendHtml = require('../../src/middlewares/sendHtml');
const errorHandler = require('../../src/middlewares/errorHandler');

jest.mock('morgan');
jest.mock('../../src/middlewares/setContext');
jest.mock('../../src/middlewares/nock');
jest.mock('../../src/middlewares/runApp');
jest.mock('../../src/middlewares/sendHtml');
jest.mock('../../src/middlewares/errorHandler');

test('returns middlewares in the correct order', async () => {
  const before = [jest.fn(), jest.fn()];
  const after = [jest.fn(), jest.fn()];
  const renderFn = jest.fn();
  const expectedArray = [
    morgan(),
    setContext(),
    applyNocks(),
    ...before,
    runApp(renderFn),
    ...after,
    sendHtml(),
    errorHandler(),
  ];
  expect(getMiddleWares({ before, after, renderFn })).toEqual(expectedArray);
});

test('handles undefined middlewares', async () => {
  const renderFn = jest.fn();
  const expectedArray = [
    morgan(),
    setContext(),
    applyNocks(),
    runApp(renderFn),
    sendHtml(),
    errorHandler(),
  ];
  expect(getMiddleWares({ renderFn })).toEqual(expectedArray);
});

test('handles renderFn setting', async () => {
  const renderFn = jest.fn();
  await getMiddleWares({ renderFn });
  expect(runApp).toHaveBeenCalledWith(renderFn);
});

test('handles nock settings', async () => {
  const nock = 'nock';
  const nockPath = 'nockPath';
  const renderFn = jest.fn();
  await getMiddleWares({ renderFn, nock, nockPath });
  expect(applyNocks).toHaveBeenCalledWith(nock, nockPath);
});
