const env = require('../src/utils/env');
const logger = require('../src/logger');

jest.mock('../src/utils/env');

jest.spyOn(global.console, 'error');
jest.spyOn(global.console, 'warn');
jest.spyOn(global.console, 'log');
jest.spyOn(global.console._stderr, 'write');
jest.spyOn(global.console._stdout, 'write');

const loggingLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
const logMethod = global.console._stdout.write;

beforeEach(() => {
  jest.resetAllMocks();
});

test('has logging methods', () => {
  for (const level of loggingLevels) {
    expect(typeof logger[level]).toBe('function');
  }
});

test('logs readable messages in development environment', () => {
  env.isProd = false;
  for (const level of loggingLevels) {
    const error = new Error('Test error');
    const expectedOutput = /Test error[\s\S]*logger\.test\.js/;
    logger[level](error);
    expect(typeof logger[level]).toBe('function');
    expect(logMethod).toBeCalledWith(expect.stringMatching(expectedOutput));
    global.console._stdout.write.mockClear();
  }
});

test('logs json in production environment', () => {
  env.isProd = true;
  for (const level of loggingLevels) {
    const message = 'Test message';
    const expectedOutput = `{"message":"${message}","level":"${level}","source":"ssr-server"}\n`;
    logger[level](message);
    expect(logMethod).toBeCalledWith(expectedOutput);
    global.console._stdout.write.mockClear();
  }
});

test('logs errors properly in production environment', () => {
  env.isProd = true;
  for (const level of loggingLevels) {
    const error = new Error('Test error');
    const expectedOutput = new RegExp(
      `\{"level":"${level}","message":"Test error","stack":".*Test error[\\s\\S]*logger\.test\.js.*","source":"ssr-server"\}`
    );
    logger[level](error);
    expect(logMethod).toBeCalledWith(expect.stringMatching(expectedOutput));
  }
});
