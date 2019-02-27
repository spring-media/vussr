module.exports = function getDevServerConfig(config) {
  return {
    contentBase: [config.outputPath, config.assetsPath],
    publicPath: config.assetsPath,
    port: 8080,
    compress: false,
    overlay: true,
    quiet: true,
    disableHostCheck: true,
  };
};
