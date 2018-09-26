const request = require('supertest');
const ProdServer = require('../lib/server.prod');

jest.mock('../lib/logger');
jest.mock('../utils/config');
jest.mock('../utils/paths');

test.skip('it runs on port 8080', async () => {
  const server = await new ProdServer().listen();
  expect(server.listener.address().port).toBe(8080);
  server.close();
});

test('serves the app', async () => {
  const server = await new ProdServer().listen();
  const response = await request(server.express).get('/');
  const expectedResponseText = expect.stringMatching(/^<!DOCTYPE html>\s*<html>\s*<head>\s*<meta charset="utf-8">\s*<meta http-equiv="X-UA-Compatible" content="IE=edge">\s*<meta name="viewport" content="width=device-width,initial-scale=1">\s*<link rel="preload" href="\/assets\/client\.[0-9a-f]+\.js" as="script"><style data-vue-ssr-id=".+?">\s*p\[data-v-[0-9]+\] \{\s*font-size: 2em;\s*text-align: center;\s*\}\s*<\/style><\/head>\s*<body><p id="#app" data-server-rendered="true" data-v-[0-9]+>Hello World!<\/p><script src="\/assets\/client\.[0-9a-f]+\.js" defer><\/script><script type="text\/javascript" src="\/assets\/client\.[0-9a-f]+\.js"><\/script><\/body>\s*<\/html>\n$/);
  expect(response.statusCode).toBe(200);
  expect(response.text).toEqual(expectedResponseText);
  server.close();
});

test('it priveds a healthcheck at /healthcheck', async () => {
  const server = await new ProdServer().listen();
  const response = await request(server.express).get('/healthcheck');
  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  expect(typeof response.body.uptime).toBe('number');
  server.close();
});
