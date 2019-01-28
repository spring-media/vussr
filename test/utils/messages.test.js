const { logDevSuccess, logDevFail } = require('../../src/utils/messages');
const logger = require('../../src/logger');

jest.mock('../../src/logger');

test('logs dev build success properly', () => {
  logDevSuccess(8080);
  expect(logger.info.mock.calls).toMatchSnapshot();
});

test('logs dev build fail properly', () => {
  const errors = ['foo error'];
  logDevFail({ errors });
  expect(logger.info.mock.calls).toMatchSnapshot();
  expect(logger.error.mock.calls).toMatchSnapshot();
});
