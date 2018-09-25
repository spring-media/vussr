#!/usr/bin/env node

const pkg = require('../package.json');
const program = require('commander');
const DevServer = require('../lib/server.dev');
const ProdServer = require('../lib/server.prod');
const Compiler = require('../lib/compiler');
const logger = require('../lib/logger');
const { printConfigHelp } = require('./utils');

['unhandledRejection', 'uncaughtException'].forEach(event => {
  process.on(event, err => logger.error(err));
});

program
  .name('udssr')
  .version(pkg.version, '-v, --version')

program
  .command('build')
  .option('-c, --config <path>', 'provide a config file')
  .description('Creates a production build')
  .action(options => new Compiler(options.config).run())
  .on('--help', printConfigHelp);

program
  .command('start')
  .option('-c, --config <path>', 'provide a config file')
  .description('Starts a formerly created build with the production server')
  .action(options => new ProdServer(options.config).listen())
  .on('--help', printConfigHelp);

program
  .command('serve')
  .option('-c, --config <path>', 'provide a config file')
  .description('Serves the app with hot reloading for development')
  .action(options => new DevServer(options.config).listen())
  .on('--help', printConfigHelp);

program
  .parse(process.argv);

module.exports = program;
