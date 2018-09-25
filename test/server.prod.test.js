const request = require('supertest');
const ProdServer = require('../lib/server.prod');

jest.mock('../utils/config');

test('placeholder', async () => {
  const server = await new ProdServer().listen();
  
});