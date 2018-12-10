const request = require('supertest');
const DevServer = require('../lib/server.dev');
const testConfig = require('./__build__');

jest.unmock('webpack')
jest.mock('../lib/logger');
jest.mock('../lib/utils/config');
jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('Dev Server', () => {

  let devServer;

  const beforeMiddleware = jest.fn().mockImplementation((req, res, next) => next());
  const afterMiddleware = jest.fn().mockImplementation((req, res, next) => next());
  const before = [...testConfig.middlewares.before, beforeMiddleware];
  const after = [...testConfig.middlewares.after, afterMiddleware];
  const config = Object.assign({}, testConfig, { middlewares: { before, after } });
  const options = { config };

  beforeAll(async () => {
    devServer = new DevServer(options);
    await new Promise(resolve => devServer.onCompile(resolve));
    await devServer.listen();
  });

  afterAll(() => {
    devServer.close();
  });

  test('it runs on port 8081', async () => {
    expect(devServer.listener.address().port).toBe(8081);
    expect(devServer.listener.listening).toBe(true);
  });

  test('serves the app\'s html', async () => {
    const response = await request(devServer.devServer.app).get('/');
    const expectedResponseText = expect.stringMatching(/^<!DOCTYPE html>\s*<html>\s*<head>\s*<meta charset="utf-8">\s*<meta http-equiv="X-UA-Compatible" content="IE=edge">\s*<meta name="viewport" content="width=device-width,initial-scale=1">\s*<link rel="preload" href="\/assets\/client\.[0-9a-f]+\.js" as="script"><style data-vue-ssr-id=".+?">\s*p\[data-v-[0-9a-f]+\] \{\s*font-size: 2em;\s*text-align: center;\s*\}\s*<\/style><\/head>\s*<body><p id="#app" data-server-rendered="true" data-v-[0-9a-f]+>Hello World!<\/p><script src="\/assets\/client\.[0-9a-f]+\.js" defer><\/script><script type="text\/javascript" src="\/assets\/client\.[0-9a-f]+\.js"><\/script><\/body>\s*<\/html>\n$/);
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(expectedResponseText);
  });

  test('serves the client js', async () => {
    const htmlResponse = await request(devServer.devServer.app).get('/');
    const clientJsPath = htmlResponse.text.match(/\/assets\/client\.[0-9a-f]+\.js/);
    const clientJsresponse = await request(devServer.devServer.app).get(clientJsPath[0]);
    expect(clientJsresponse.statusCode).toBe(200);
  });

  // TODO this test is not clean as the middleware will also be called
  // TODO by other tests, but instantiating a new devServer for this
  // TODO test ends up in a timeout and we need to finish the MVP before
  // TODO we have the time to fix this
  test('applies before middlewares', async () => {
    await request(devServer.devServer.app).get('/');
    expect(beforeMiddleware).toHaveBeenCalled();
  });

  // TODO this test is not clean as the middleware will also be called
  // TODO by other tests, but instantiating a new devServer for this
  // TODO test ends up in a timeout and we need to finish the MVP before
  // TODO we have the time to fix this
  test('applies after middlewares', async () => {
    await request(devServer.devServer.app).get('/');
    expect(afterMiddleware).toHaveBeenCalled();
  });

})
