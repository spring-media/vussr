const path = require('path');
const DevServer = require('../src/server.dev');

(async () => {
  const configPath = path.resolve(__dirname, 'udssr.config.js');
  await new DevServer(configPath).listen();
})();
