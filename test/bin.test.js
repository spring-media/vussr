const bin = require('../bin');
const logger = require('../lib/logger');

jest.mock('../lib/utils/config');
jest.mock('../lib/logger');

// This test does not work yet because of a bug in jest:
// https://github.com/facebook/jest/issues/5620
test.skip('catches unhandled rejections', async () => {
  const error = new Error('mock error');
  await Promise.reject(error);
  expect(logger.error).toHaveBeenCalledWith(error);
});

// https://stackoverflow.com/questions/52493145/how-to-test-a-unhandledrejection-uncaughtexception-handler-with-jest
test.skip('catches uncaught exceptions', () => {
  const error = new Error('mock error');
  throw error;
  expect(logger.error).toHaveBeenCalledWith(error);
});