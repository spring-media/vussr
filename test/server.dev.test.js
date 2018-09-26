const request = require('supertest');
const DevServer = require('../lib/server.dev');

jest.unmock('webpack')
jest.mock('../lib/logger');
jest.mock('../lib/utils/config');
jest.spyOn(global.console, 'log').mockImplementation(() => {});

let devServer;

beforeAll(async () => {
  devServer = await new DevServer();
  await new Promise(resolve => devServer.onCompile(resolve));
  await devServer.listen();
});

afterAll(() => {
  devServer.close();
});

test('it runs on port 8080', async () => {
  expect(devServer.listener.address().port).toBe(8080);
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
  const clientJsresponse = await request(devServer.devServer.app).get(clientJsPath);
  expect(clientJsresponse.statusCode).toBe(200);
});
