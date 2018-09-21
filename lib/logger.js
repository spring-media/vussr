const { createLogger, format, transports } = require('winston');
const PrettyError = require('pretty-error');
const { isProd } = require('../utils/env');

const { combine, label, colorize, printf } = format;
const prettyError = new PrettyError();

prettyError.appendStyle({
  'pretty-error': { marginTop: 0 },
  'pretty-error > header': { marginTop: 1 },
  'pretty-error > trace > item': { marginBottom: 0, },
  'pretty-error > trace > item > header > what': { display: 'none' },
  'pretty-error > trace > item > header': { display: 'inline' },
  'pretty-error > trace > item > footer': { display: 'inline' },
  'pretty-error > trace > item > footer > addr': { display: 'inline' },
});


function prodFormat() {
  const extractError = ({ message, stack }) => ({ message, stack })
  const error = format(info => info instanceof Error ? { ...info, ...extractError(info) } : info);
  const source = format((info, source) => ({ ...info, source }));
  return combine(error(), source('ssr-server'), format.json());
}

function devFormat() {
  const formatMessage = info => `${info.level} ${info.message}`;
  const formatError = info => prettyError.render(info);
  const format = info => info instanceof Error ? formatError(info) : formatMessage(info);
  return combine(colorize(), printf(format))
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  exitOnError: false,
  transports: [new transports.Console()],
  format: true ? prodFormat() : devFormat(),
});

module.exports = logger;