const fs = require('fs');
const { appHtml, appPublic } = require('../utils/paths');

function getRenderOptions() {
  return {
    template: fs.readFileSync(appHtml, 'utf-8'),
    publicPath: appPublic,
    runInNewContext: false,
  };
}

module.exports = {
  getRenderOptions,
};
