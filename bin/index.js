#!/usr/bin/env node

const pkg = require('../package.json');
const program = require('commander');
const DevServer = require('../lib/server.dev');
const ProdServer = require('../lib/server.prod');
const Compiler = require('../lib/compiler');
const { printConfigHelp, catchUnhandledErrors, ensureGracefulShutdown } = require('./utils');

catchUnhandledErrors();
ensureGracefulShutdown();

program
  .name('udssr')
  .version(pkg.version, '-v, --version')
  .option('-n, --nock', 'Start in nock mode (Load recorded nocks)')
  .option('-r, --record', 'Record external requests with nock (use with --nock)')
  .option('--nockPath [nockPath]', 'Where external request records should go or be loaded from')

program
  .command('build')
  .option('-c, --config <path>', 'provide a config file')
  .description('Creates a production build')
  .action(options => new Compiler(options).run())
  .on('--help', printConfigHelp);

program
  .command('start')
  .option('-c, --config <path>', 'provide a config file')
  .description('Starts a formerly created build with the production server')
  .action(async options => ensureGracefulShutdown.server = await new ProdServer(options).listen())
  .on('--help', printConfigHelp);

program
  .command('serve')
  .option('-c, --config <path>', 'provide a config file')
  .description('Serves the app with hot reloading for development')
  .action(async options => ensureGracefulShutdown.server = await new DevServer(options).listen())
  .on('--help', printConfigHelp);

program
  .parse(process.argv);

module.exports = program;
