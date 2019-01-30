const request = require('supertest');
const DevServer = require('../src/server.dev');
const {
  beforeMiddleware,
  afterMiddleware,
  options,
} = require('./fixtures/testApp/udssr.config.js');

jest.unmock('webpack');
jest.mock('../webpack/index');
jest.mock('../src/logger');

describe('Dev Server', () => {
  let devServer;

  beforeAll(async () => {
    devServer = await new DevServer(options).listen();
  });

  afterAll(async () => {
    await devServer.close();
  });

  test.skip('it runs on port 8080', async () => {
    expect(devServer.listener.address().port).toBe(8080);
    expect(devServer.listener.listening).toBe(true);
  });

  test.skip("serves the app's html", async () => {
    const response = await request(devServer.devServer.app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatchSnapshot();
  });

  test('serves the client js', async () => {
    const clientJsresponse = await request(devServer.devServer.app).get('/assets/main.js');
    expect(clientJsresponse.statusCode).toBe(200);
  });

  test('applies before middlewares', async () => {
    beforeMiddleware.mockClear();
    await request(devServer.devServer.app).get('/');
    expect(beforeMiddleware).toHaveBeenCalled();
  });

  test.skip('applies after middlewares', async () => {
    afterMiddleware.mockClear();
    await request(devServer.devServer.app).get('/');
    expect(afterMiddleware).toHaveBeenCalled();
  });
});
