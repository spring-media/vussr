const path = require('path');
const Compiler = require('../src/compiler');

(async () => {
  const configPath = path.resolve(__dirname, 'udssr.config.js');
  await new Compiler(configPath).run();
})();
