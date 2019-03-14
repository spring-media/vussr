module.exports = function getDevServerConfig(config) {
  return {
    contentBase: [config.outputPath, config.assetsPath],
    /**
     * Workaround because publicPath can't handle a path with spaces inside.
     * This applies for unecaped as well escaped space characters.
     * On the other hand all other configured path values for the webpack dev server
     * can't handle an absoulte path escaped by quotation marks.
     **/
    publicPath: `"${config.assetsPath}"`,
    port: 8080,
    compress: false,
    overlay: true,
    quiet: true,
    disableHostCheck: true,
  };
};
