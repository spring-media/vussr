const path = require('path');
const DevServer = require('../../../src/server.dev');

(async () => {
  const configPath = path.resolve(__dirname, 'vussr.config.js');
  const options = require(configPath).options;
  await new DevServer(options).listen();
})();
