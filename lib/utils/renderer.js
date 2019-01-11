const {  appPublic } = require('./paths');

function getRenderOptions() {
  return {
    publicPath: appPublic,
    runInNewContext: false,
  };
}

module.exports = getRenderOptions;
