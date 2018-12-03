const errorHandler = require('../../lib/middlewares/errorHandler');
const logger = require("../../lib/logger");

jest.mock("../../lib/logger");

function setup() {
  const middleware = errorHandler();
  const err = new Error('Test Error');
  const err404 = new Error('Not Found');
  const err504 = new Error('Gateway Timeout');
  const sendStatus = jest.fn();
  const req = {};
  const res = { sendStatus };
  const next = jest.fn();
  err404.statusCode = 404;
  err504.statusCode = 504;
  return { middleware, err, err404, err504, req, res, next };
}

test('only calls next if no error is given', () => {
  const { middleware, req, res, next } = setup();
  middleware(null, req, res, next);
  expect(next).toHaveBeenCalledWith();
  expect(res.sendStatus).not.toHaveBeenCalled();
});

test('calls next on 404s', () => {
  const { middleware, err404, req, res, next } = setup();
  middleware(err404, req, res, next);
  expect(next).toHaveBeenCalledWith();
  expect(res.sendStatus).not.toHaveBeenCalled();
});

test('logs an error', () => {
  const { middleware, err, req, res, next } = setup();
  middleware(err, req, res, next);
  expect(next).not.toHaveBeenCalledWith();
  expect(logger.error).toHaveBeenCalledWith(err);
});

test('sends a 500 status code', () => {
  const { middleware, err, req, res, next } = setup();
  middleware(err, req, res, next);
  expect(next).not.toHaveBeenCalledWith();
  expect(res.sendStatus).toHaveBeenCalledWith(500);
});

test('sends the statusCode from an error object', () => {
  const { middleware, err504, req, res, next } = setup();
  middleware(err504, req, res, next);
  expect(next).not.toHaveBeenCalledWith();
  expect(res.sendStatus).toHaveBeenCalledWith(err504.statusCode);
});
