const request = require('supertest');
const ProdServer = require('../lib/server.prod');

jest.mock('../lib/logger');
jest.mock('../utils/config');
jest.mock('../utils/paths');

test('serves the app', async () => {
  const server = await new ProdServer().listen();
  const response = await request(server.express).get('/');
  const expectedResponseText = `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n  <link rel=\"preload\" href=\"/assets/client.f04b1227428fe9a21c13.js\" as=\"script\"><style data-vue-ssr-id=\"197ec0a7:0\">\np[data-v-91585330] {\n  font-size: 2em;\n  text-align: center;\n}\n</style></head>\n	<body><p id=\"#app\" data-server-rendered=\"true\" data-v-91585330>Hello World!</p><script src=\"/assets/client.f04b1227428fe9a21c13.js\" defer></script><script type=\"text/javascript\" src=\"/assets/client.f04b1227428fe9a21c13.js\"></script></body>\n</html>\n`
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe(expectedResponseText);
});
