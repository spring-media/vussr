const path = require('path');
const Compiler = require('../src/compiler');

(async () => {
  const configPath = path.resolve(__dirname, 'vussr.config.js');
  const options = require(configPath);
  await new Compiler(options).run();
})();
