const writeAccessLogs = require('../../lib/middlewares/writeAccessLogs');
const morgan = require('morgan');

jest.mock('morgan');
jest.mock('on-finished');
jest.spyOn(global.console, 'log').mockImplementation(() => {});

function setup() {
  const originalUrl = "originalUrl";
  const statusCode = 200;
  const req = { originalUrl };
  const res = { statusCode };
  const next = jest.fn();
  return { req, res, next, originalUrl };
};

test('doesn\'t do anything with the logFormat set to false', async () => {
  const { req, res, next } = setup();
  const middleware = writeAccessLogs(false);
  middleware(req, res, next);
  expect(next).toHaveBeenCalledWith();
});

test('logs accesses development format with the logFormat set to "development"', async () => {
  const { req, res, next, originalUrl } = setup();
  const middleware = writeAccessLogs("development");
  const expectedLog = new RegExp(`  - ${res.statusCode} \\d{1,2}:\\d{1,2}:\\d{1,2} PM \\d+.\\d+s`);
  await middleware(req, res, next);
  expect(next).toHaveBeenCalledWith();
  expect(global.console.log).toHaveBeenCalledWith(expect.stringMatching(expectedLog), originalUrl);
});

test('returns a "morgan" middleware with the common format with the logFormat set to true', async () => {
  const middleware = writeAccessLogs(true);
  expect(morgan).toHaveBeenCalledWith('common');
  expect(middleware).toBe('morganMockReturnValue');
});

test('returns a "morgan" middleware with the common format with the logFormat set to undefined', async () => {
  const middleware = writeAccessLogs();
  expect(morgan).toHaveBeenCalledWith('common');
  expect(middleware).toBe('morganMockReturnValue');
});

test('returns a "morgan" middleware with the common format with the logFormat set to "clf"', async () => {
  const middleware = writeAccessLogs("clf");
  expect(morgan).toHaveBeenCalledWith('common');
  expect(middleware).toBe('morganMockReturnValue');
});
