const path = require('path');

/**
 * Transforming the public path to an relative path and check if it contains
 * space symbols. This is a workaround because publicPath can't handle a path
 * with spaces inside. This applies for unescaped as well escaped space characters.
 * On the other hand all other configured path values for the webpack dev server
 * should be absolute and can't handle an absoulte path escaped by quotation marks.
 **/
const exceptionMsg = val => `Spaces are not allowed inside the WebPack publicPath: ${val}`;
const testSpaces = val => { if (/\s/.test(val)) { throw new Error(exceptionMsg(val))} return val };
const transformSlashes = val => val.replace(/\\/, '/').replace(/^\/?/, '/').replace(/\/?$/, '/');
const relativePath = val => transformSlashes(testSpaces(path.relative(process.cwd(), val)));

module.exports = function getDevServerConfig(config) {
  return {
    contentBase: [config.outputPath, config.assetsPath],
    publicPath: relativePath(config.assetsPath),
    port: 8080,
    compress: false,
    overlay: true,
    quiet: true,
    disableHostCheck: true,
  };
};
