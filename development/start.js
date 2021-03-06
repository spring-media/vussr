const path = require('path');
const ProdServer = require('../src/server.prod');

(async () => {
  const configPath = path.resolve(__dirname, 'vussr.config.js');
  const options = require(configPath);
  await new ProdServer(options).listen();
})();
