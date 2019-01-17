#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const DevServer = require('../src/server.dev');
const ProdServer = require('../src/server.prod');
const Compiler = require('../src/compiler');
const { printConfigHelp, logUnhandledErrors } = require('./utils');

logUnhandledErrors();

program
  .name('udssr')
  .version(pkg.version, '-v, --version')
  .option('-c, --config <path>', 'Path to a config file')
  .option('-n, --nock', 'Start in nock mode (load recorded nocks)')
  .option('-r, --record', 'Record external requests with nock (always use together with --nock)')
  .option('--nockPath [nockPath]', 'Where external request records should go or be loaded from')
  .on('--help', printConfigHelp);

program
  .command('build')
  .description('Creates a production build')
  .action(async options => await new Compiler(options).run());

program
  .command('start')
  .description('Starts a formerly created build with the production server')
  .action(async options => await new ProdServer(options).listen());

program
  .command('serve')
  .description('Serves the app with hot reloading for development')
  .action(async options => await new DevServer(options).listen());

program.parse(process.argv);

module.exports = program;
