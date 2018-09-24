const env = require('../utils/env');
const logger = require('../lib/logger');

jest.mock('../utils/env');

jest.spyOn(global.console, 'error');
jest.spyOn(global.console, 'warn');
jest.spyOn(global.console, 'log');
jest.spyOn(global.console._stderr, 'write');
jest.spyOn(global.console._stdout, 'write');

const loggingLevels = ["error", "warn", "info", "verbose", "debug", "silly"];
const logMethod = global.console._stdout.write;

beforeEach(() => {
  jest.resetAllMocks();
});

test.skip('has logging methods', () => {
  for (const level of loggingLevels) {
    expect(typeof logger[level]).toBe('function');
  }
});

test.skip('logs readable in development environment', () => {
  env.isProd.mockImplementation(() => false);
  for (const level of loggingLevels) {
    const error = new Error('Test error');
    const expectedOutput = /Test error[\s\S]*logger\.test\.js/;
    logger[level](error);
    expect(typeof logger[level]).toBe('function');
    expect(logMethod).toBeCalledWith(expect.stringMatching(expectedOutput));
    global.console._stdout.write.mockClear();
  };
});

test.skip('logs json in production environment', () => {
  env.isProd.mockImplementation(() => true);
  loggingLevels.forEach((level) => {
    const message = 'Test message';
    const expectedOutput = `{"message":"${message}","level":"${level}","source":"ssr-server"}\n`;
    logger[level](message);
    expect(logMethod).toBeCalledWith(expectedOutput);
    global.console._stdout.write.mockClear();
  });
});

test.skip('logs errors properly in production environment', () => {
  env.isProd.mockImplementation(() => true);
  loggingLevels.forEach((level) => {
    const error = new Error('Test error');
    const expectedOutput = /\{"level":"error","message":"Test error","stack":".*Test error[\s\S]*logger\.test\.js.*","source":"ssr-server"\}/;
    logger.error(error);
    expect(logMethod).toBeCalledWith(expect.stringMatching(expectedOutput));
  });
});
