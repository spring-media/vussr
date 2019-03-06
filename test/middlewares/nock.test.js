const { nockMiddleware, replayNocks, recordMiddleware, replayMiddleware } = require('express-nock');
const applyNocks = require('../../src/middlewares/nock');

jest.mock('express-nock');

test('it returns a nock record middleware', () => {
  const mode = 'record';
  const nockPath = 'nockPath';
  const middleware = applyNocks(mode, nockPath);
  expect(nockMiddleware).toHaveBeenCalledWith({ nockPath });
  expect(middleware).toBe(recordMiddleware);
});

test('it returns a nock replay middleware', () => {
  const mode = 'replay';
  const nockPath = 'nockPath';
  const middleware = applyNocks(mode, nockPath);
  expect(replayNocks).toHaveBeenCalledWith({ nockPath });
  expect(middleware).toBe(replayMiddleware);
});

test('it returns a middleware that calls next', () => {
  const next = jest.fn();
  const middleware = applyNocks();
  middleware(null, null, next);
  expect(next).toHaveBeenCalledWith();
});
