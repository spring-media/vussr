describe('util env', () => {
  let originalEnv;

  beforeEach(() => {
    jest.resetModules();
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('isProd is true if NODE_ENV === production', () => {
    process.env.NODE_ENV = 'production';
    const isProd = require('../../src/utils/env').isProd;
    expect(isProd).toBe(true);
  });

  test('isProd is false if NODE_ENV === developmen', () => {
    process.env.NODE_ENV = 'development';
    const isProd = require('../../src/utils/env').isProd;
    expect(isProd).toBe(false);
  });

  test('isProd is false if NODE_ENV === test', () => {
    process.env.NODE_ENV = 'test';
    const isProd = require('../../src/utils/env').isProd;
    expect(isProd).toBe(false);
  });
});
