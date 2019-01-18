#!/usr/bin/env node

const program = require('commander');
const cosmiconfig = require('cosmiconfig');
const pkg = require('../package.json');
const DevServer = require('../src/server.dev');
const ProdServer = require('../src/server.prod');
const Compiler = require('../src/compiler');
const { printConfigHelp, logUnhandledErrors } = require('./utils');

(async () => {
  const explorer = cosmiconfig('udssr');
  const { config } = await explorer.search();

  logUnhandledErrors();

  program
    .name('udssr')
    .version(pkg.version, '-v, --version')
    .option('-n, --nock', 'Start in nock mode (load recorded nocks)')
    .option('-r, --record', 'Record external requests with nock (always use together with --nock)')
    .option('--nockPath [nockPath]', 'Where external request records should go or be loaded from')
    .on('--help', printConfigHelp);

  program
    .command('build')
    .description('Creates a production build')
    .action(async () => await new Compiler(config).run());

  program
    .command('start')
    .description('Starts a formerly created build with the production server')
    .action(async () => await new ProdServer(config).listen());

  program
    .command('serve')
    .description('Serves the app with hot reloading for development')
    .action(async () => await new DevServer(config).listen());

  program.parse(process.argv);

  module.exports = program;
})();
