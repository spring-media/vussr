#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const DevServer = require('../src/server.dev');
const ProdServer = require('../src/server.prod');
const Compiler = require('../src/compiler');
const { logUnhandledErrors, getConfig } = require('./utils');

(async () => {
  const config = await getConfig();

  logUnhandledErrors();

  program
    .name('vussr')
    .version(pkg.version, '-v, --version')
    .option('-n, --nock', 'start in nock mode (load recorded nocks)')
    .option('-r, --record', 'record external requests with nock (always use together with --nock)')
    .option('--nockPath [nockPath]', 'where external request records should go or be loaded from');

  program
    .command('build')
    .description('creates a production build')
    .action(async cliOptions => await new Compiler(config, cliOptions).run());

  program
    .command('start')
    .description('starts a formerly created build with the production server')
    .action(async cliOptions => await new ProdServer(config, cliOptions).listen());

  program
    .command('serve')
    .description('serves the app with hot reloading for development')
    .action(async cliOptions => await new DevServer(config, cliOptions).listen());

  program.parse(process.argv);
})();

module.exports = program;
