const middleware = require('../lib/middleware');
const logger = require('../lib/logger');

jest.mock('../lib/logger');

const req = { originalUrl: 'original url' };
const res = { end: jest.fn(), sendStatus: jest.fn() };
const next = jest.fn();
const html = '<p>Some test html</p>';
const render = jest.fn(async () => html);
const m = middleware(render);

beforeEach(() => {
  jest.clearAllMocks();
});

test('passes the originalUrl to the provided render function', async () => {
  await m(req, res, next);
  expect(render).toHaveBeenCalledWith(req.originalUrl);
});

test('ends the response with the rendered html', async () => {
  await m(req, res, next);
  expect(res.end).toHaveBeenCalledWith(html);
});

test('handles erros by default with the default statusCode', async () => {
    const error = new Error('Test error message');
    render.mockImplementationOnce(() => { throw error });
    await m(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(logger.error).toHaveBeenCalledWith(error);
});

test('handles erros by default with a provided statusCode', async () => {
  const error = { statusCode: 404 };
  render.mockImplementationOnce(() => { throw error });
  await m(req, res, next);
  expect(res.sendStatus).toHaveBeenCalledWith(error.statusCode);
  expect(logger.error).toHaveBeenCalledWith(error);
});

test('uses a custom eror handler', async () => {
  const errorHandler = jest.fn();
  const mWithCustomErrorHandler = middleware(render, errorHandler);
  const error = new Error('Test error message');
  render.mockImplementationOnce(() => { throw error });
  await mWithCustomErrorHandler(req, res, next);
  expect(errorHandler).toHaveBeenCalledWith(error, req, res, next);
});