const morgan = require('morgan');
const writeAccessLogs = require('../../src/middlewares/accessLogs');
const logger = require('../../src/logger');

jest.mock('../../src/logger');

describe('access logs', () => {
  jest.mock('morgan');
  jest.mock('on-finished');

  function setup() {
    const originalUrl = 'originalUrl';
    const statusCode = 200;
    const req = { originalUrl };
    const res = { statusCode };
    const next = jest.fn();
    return { req, res, next, originalUrl };
  }

  test('logs accesses development format with the logFormat set to "development"', async () => {
    const { req, res, next, originalUrl } = setup();
    const middleware = writeAccessLogs('development');
    const message = expect.stringMatching(
      new RegExp(
        `\\u001b\\[2m  - ${
          res.statusCode
        } \\d{1,2}:\\d{1,2}:\\d{1,2} \\d+.\\d+s \\u001b\\[22m${originalUrl}`
      )
    );
    const prefix = false;
    await middleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(logger.info).toHaveBeenCalledWith(expect.objectContaining({ message, prefix }));
  });

  test('returns a "morgan" middleware with the common format with the logFormat set to true', async () => {
    const middleware = writeAccessLogs(true);
    expect(morgan).toHaveBeenCalledWith('common');
    expect(middleware).toBe(morgan());
  });

  test('returns a "morgan" middleware with the common format with the logFormat set to undefined', async () => {
    const middleware = writeAccessLogs();
    expect(morgan).toHaveBeenCalledWith('common');
    expect(middleware).toBe(morgan());
  });

  test('returns a "morgan" middleware with the common format with the logFormat set to "clf"', async () => {
    const middleware = writeAccessLogs('clf');
    expect(morgan).toHaveBeenCalledWith('common');
    expect(middleware).toBe(morgan());
  });
});
