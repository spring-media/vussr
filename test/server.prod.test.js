const request = require('supertest');
const ProdServer = require('../src/server.prod');
const {
  beforeMiddleware,
  afterMiddleware,
  options,
} = require('./fixtures/testApp/vussr.config.js');

jest.unmock('webpack');
jest.unmock('morgan');
jest.unmock('on-finished');
jest.mock('../webpack/index');
jest.mock('../src/logger');

describe('Prod Server', () => {
  let server;
  let gzipServer;
  let renderOptionsServer;

  beforeAll(async () => {
    server = await new ProdServer(options).listen();
    gzipServer = await new ProdServer({
      ...options,
      port: 7070,
      compressAssets: true,
      compressHTML: true,
    }).listen();
    renderOptionsServer = await new ProdServer({
      ...options,
      port: 6060,
      bundleRendererOptions: {
        shouldPreload: () => false,
      }
    }).listen();
  });

  afterAll(() => {
    server.close();
    gzipServer.close();
    renderOptionsServer.close();
  });

  test('it runs on port 8080', async () => {
    expect(server.listener.address().port).toBe(8080);
    expect(server.listener.listening).toBe(true);
  });

  test("serves the app's html", async () => {
    const response = await request(server.app).get('/');
    expect(response.headers['content-type']).toBe('text/html');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatchSnapshot();
  });

  test("serves the compressed app's html", async () => {
    const response = await request(gzipServer.app).get('/');
    expect(response.headers['content-type']).toBe('text/html');
    expect(response.headers['content-encoding']).toBe('gzip');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatchSnapshot();
  });

  test("serves the no prefetch links because of bundleRendererOptions", async () => {
    const response = await request(renderOptionsServer.app).get('/');
    expect(response.headers['content-type']).toBe('text/html');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatchSnapshot();
  });

  test('serves the client js', async () => {
    const response = await request(server.app).get('/assets/client.js');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatchSnapshot();
  });

  test('serves the compressed client js', async () => {
    const response = await request(gzipServer.app).get('/assets/client.js');    
    expect(response.headers['content-encoding']).toBe('gzip');
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
