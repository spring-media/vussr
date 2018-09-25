const {  appPublic } = require('../utils/paths');

function getRenderOptions() {
  return {
    publicPath: appPublic,
    runInNewContext: false,
  };
}

module.exports = {
  getRenderOptions,
};
