#!/usr/bin/env node

const pkg = require('../package.json');
const program = require('commander');
const DevServer = require('../lib/server.dev');
const ProdServer = require('../lib/server.prod');
const Compiler = require('../lib/compiler');
const logger = require('../lib/logger');
const { printConfigHelp } = require('./utils');

let server = null;

['unhandledRejection', 'uncaughtException'].forEach(event => {
  process.on(event, err => logger.error(err));
});

['SIGTERM'].forEach(event => {
  process.on(event, () => server && server.close().then(() => process.exit(0)));
});

program
  .name('udssr')
  .version(pkg.version, '-v, --version')

program
  .command('build')
  .option('-c, --config <path>', 'provide a config file')
  .option('-e, --extend <path>', 'provide a config file to extend default config')
  .description('Creates a production build')
  .action(options => new Compiler(options).run())
  .on('--help', printConfigHelp);

program
  .command('start')
  .option('-c, --config <path>', 'provide a config file')
  .option('-e, --extend <path>', 'provide a config file to extend default config')
  .description('Starts a formerly created build with the production server')
  .action(options => server = new ProdServer(options).listen())
  .on('--help', printConfigHelp);

program
  .command('serve')
  .option('-c, --config <path>', 'provide a config file')
  .option('-e, --extend <path>', 'provide a config file to extend default config')
  .description('Serves the app with hot reloading for development')
  .action(options => server = new DevServer(options).listen())
  .on('--help', printConfigHelp);

program
  .parse(process.argv);

module.exports = program;
