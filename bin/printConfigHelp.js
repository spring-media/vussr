module.exports = function printConfigHelp() {
  console.log('');
  console.log('  With the -c or --config option provide the path to a config file');
  console.log('  The config file should export a JSON with 3 fields:');
  console.log('');
  console.log('  { client, server, devServer }');
  console.log('');
  console.log('  Each field should contain a webpack configuration:');
  console.log('');
  console.log('  client:    This is the webpack config used to create the client bundle');
  console.log('  server:    This is the webpack config used to server the client bundle');
  console.log('  devServer: These are the options passed to the dev server: https://webpack.js.org/configuration/dev-server/');
  console.log('');
}
