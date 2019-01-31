const request = require('supertest');
const ProdServer = require('../src/server.prod');
const {
  beforeMiddleware,
  afterMiddleware,
  options,
} = require('./fixtures/testApp/udssr.config.js');

jest.unmock('webpack');
jest.mock('../webpack/index');
jest.mock('../src/logger');

describe('Prod Server', () => {
  let server;

  beforeAll(async () => {
    server = await new ProdServer(options).listen();
  });

  afterAll(() => {
    server.close();
  });

  test('it runs on port 8080', async () => {
    expect(server.listener.address().port).toBe(8080);
    expect(server.listener.listening).toBe(true);
  });

  test("serves the app's html", async () => {
    const response = await request(server.app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatchSnapshot();
  });

  test('serves the client js', async () => {
    const response = await request(server.app).get('/assets/client.js');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatchSnapshot();
  });

  test('it provides a healthcheck at /healthcheck', async () => {
    const response = await request(server.app).get('/healthcheck');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(typeof response.body.uptime).toBe('number');
  });

  test('applies before middlewares', async () => {
    beforeMiddleware.mockClear();
    await request(server.app).get('/');
    expect(beforeMiddleware).toHaveBeenCalled();
  });

  test('applies after middlewares', async () => {
    afterMiddleware.mockClear();
    await request(server.app).get('/');
    expect(afterMiddleware).toHaveBeenCalled();
  });
});
