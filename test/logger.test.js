const env = require('../utils/env');
const logger = require('../lib/logger');

jest.mock('../utils/env');

jest.spyOn(global.console, 'error');
jest.spyOn(global.console, 'warn');
jest.spyOn(global.console, 'log');
jest.spyOn(global.console._stderr, 'write');
jest.spyOn(global.console._stdout, 'write');

const logMethodProd = global.console._stdout.write;

beforeEach(() => {
  jest.resetAllMocks();
});

test('has logging methods', () => {
  expect(typeof logger.error).toBe('function');
  expect(typeof logger.warn).toBe('function');
  expect(typeof logger.info).toBe('function');
  expect(typeof logger.verbose).toBe('function');
  expect(typeof logger.debug).toBe('function');
  expect(typeof logger.silly).toBe('function');
});

test('logs readable in development environment', () => {
  env.isProd.mockImplementationOnce(() => false);
  const error = new Error('Test error');
  const expectedOutput = /Test error[\s\S]*logger\.test\.js/;
  logger.error(error);
  expect(logMethodProd).toBeCalledWith(expect.stringMatching(expectedOutput));
});

test('logs json in production environment', () => {
  env.isProd.mockImplementationOnce(() => true);
  const message = 'Test message';
  const expectedOutput = "{\"message\":\"Test message\",\"level\":\"error\",\"source\":\"ssr-server\"}";
  logger.error(message);
  expect(logMethodProd).toBeCalledWith(expect.stringMatching(expectedOutput));
});

test('logs errors properly in production environment', () => {
  env.isProd.mockImplementationOnce(() => true);
  const error = new Error('Test error');
  const expectedOutput = /\{"level":"error","message":"Test error","stack":".*Test error[\s\S]*logger\.test\.js.*","source":"ssr-server"\}/;
  logger.error(error);
  expect(logMethodProd).toBeCalledWith(expect.stringMatching(expectedOutput));
});
