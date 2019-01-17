const path = require('path');
const ProdServer = require('../src/server.prod');

(async () => {
  const configPath = path.resolve(__dirname, 'udssr.config.js');
  await new ProdServer(configPath).listen();
})();
