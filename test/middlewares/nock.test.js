const { nockMiddleware, replayNocks, recordMiddleware, replayMiddleware } = require('express-nock');
const applyNocks = require('../../src/middlewares/nock');

jest.mock('express-nock');
jest.unmock('../../src/middlewares/nock');

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
  const next = jest.fn();
  const middleware = applyNocks(mode, nockPath);
  middleware(null, null, next);
  expect(replayNocks).toHaveBeenCalledWith({ nockPath });
  expect(next).toHaveBeenCalledWith();
});

test('it returns a middleware that calls next', () => {
  const next = jest.fn();
  const middleware = applyNocks();
  middleware(null, null, next);
  expect(next).toHaveBeenCalledWith();
});
