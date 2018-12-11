const request = require('supertest');
const ProdServer = require('../lib/server.prod');
const testConfig = require('./__build__');

jest.mock('../lib/logger');
jest.mock('../lib/utils/config');
jest.mock('../lib/utils/paths');

describe('Prod Server', () => {

  let server;

  beforeAll(async () => {
    server = await new ProdServer().listen();
  });

  afterAll(() => {
    server.close();
  });

  test('it runs on port 8080', async () => {
    expect(server.listener.address().port).toBe(8080);
    expect(server.listener.listening).toBe(true);
  });

  test('serves the app\'s html', async () => {
    const response = await request(server.app).get('/');
    const expectedResponseText = expect.stringMatching(/^<!DOCTYPE html>\s*<html>\s*<head>\s*<meta charset="utf-8">\s*<meta http-equiv="X-UA-Compatible" content="IE=edge">\s*<meta name="viewport" content="width=device-width,initial-scale=1">\s*<link rel="preload" href="\/assets\/client\.[0-9a-f]+\.js" as="script"><style data-vue-ssr-id=".+?">\s*p\[data-v-[0-9a-f]+\] \{\s*font-size: 2em;\s*text-align: center;\s*\}\s*<\/style><\/head>\s*<body><p id="#app" data-server-rendered="true" data-v-[0-9a-f]+>Hello World!<\/p><script src="\/assets\/client\.[0-9a-f]+\.js" defer><\/script><script type="text\/javascript" src="\/assets\/client\.[0-9a-f]+\.js"><\/script><\/body>\s*<\/html>\n$/);
    expect(response.text).toEqual(expectedResponseText);
    expect(response.statusCode).toBe(200);
  });

  test('serves the client js', async () => {
    const htmlResponse = await request(server.app).get('/');
    const clientJsPath = htmlResponse.text.match(/\/assets\/client\.[0-9a-f]+\.js/);
    const clientJsresponse = await request(server.app).get(clientJsPath);
    expect(clientJsresponse.statusCode).toBe(200);
  });

  test('it provides a healthcheck at /healthcheck', async () => {
    const response = await request(server.app).get('/healthcheck');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(typeof response.body.uptime).toBe('number');
  });

  test.skip('applies before middlewares', async () => {
    server.close();
    const beforeMiddleware = jest.fn().mockImplementation((req, res, next) => next());
    const before = [beforeMiddleware];
    const config = Object.assign({}, testConfig, { middlewares: { before } });
    const options = { config };
    const serverWithMiddleWare = await new ProdServer(options).listen();
    await request(serverWithMiddleWare.app).get('/');
    expect(beforeMiddleware).toHaveBeenCalled()
    serverWithMiddleWare.close();
    server = await new ProdServer().listen();
  });

  test.skip('applies after middlewares', async () => {
    server.close();
    const afterMiddleware = jest.fn().mockImplementation((req, res, next) => next());
    const after = [afterMiddleware];
    const config = Object.assign({}, testConfig, { middlewares: { after } });
    const options = { config };
    const serverWithMiddleWare = await new ProdServer(options).listen();
    await request(serverWithMiddleWare.app).get('/');
    expect(afterMiddleware).toHaveBeenCalled()
    serverWithMiddleWare.close();
    server = await new ProdServer().listen();
  });

})
