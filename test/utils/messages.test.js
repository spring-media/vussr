const { logDevSuccess, logDevFail, getErrors } = require('../../src/utils/messages');
const logger = require('../../src/logger');

jest.mock('../../src/logger');

function setup() {
  const errorA = new Error('Error A');
  const errorB = new Error('Error B');
  const errors = [errorA, errorB];
  return { errorA, errorB, errors };
}

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

test('reads errors from stats', () => {
  const { errors } = setup();
  const stats = { errors };
  expect(getErrors(stats)).toEqual(errors);
});

test('reads errors from stats', () => {
  const { errors } = setup();
  const compilation = { errors };
  const stats = { compilation };
  expect(getErrors(stats)).toEqual(errors);
});

test('reads errors from stats', () => {
  const { errors } = setup();
  const stats = { errors };
  const statsContainingStats = { stats };
  expect(getErrors(statsContainingStats)).toEqual(errors);
});

test('reads errors from stats', () => {
  const { errors } = setup();
  const compilation = { errors };
  const stats = { compilation };
  expect(getErrors([stats, stats])).toEqual([...errors, ...errors]);
});
