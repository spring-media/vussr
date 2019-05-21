const winston = require('winston');
const requestId = require('./middlewares/requestId');
const PrettyError = require('pretty-error');
const { isProd } = require('./utils/env');

const { combine, colorize, printf } = winston.format;
const prettyError = new PrettyError();
const prodFormat = getProdFormat();
const devFormat = getDevFormat();
const format = winston.format((...args) =>
  isProd ? prodFormat.transform(...args) : devFormat.transform(...args)
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'silly',
  exitOnError: false,
  transports: [new winston.transports.Console()],
  format: format(),
});

prettyError.appendStyle({
  'pretty-error': { marginTop: 0 },
  'pretty-error > header': { marginTop: 1 },
  'pretty-error > trace > item': { marginBottom: 0 },
  'pretty-error > trace > item > header > what': { display: 'none' },
  'pretty-error > trace > item > header': { display: 'inline' },
  'pretty-error > trace > item > footer': { display: 'inline' },
  'pretty-error > trace > item > footer > addr': { display: 'inline' },
});

function getProdFormat() {
  const extractError = ({ message, stack }) => ({ message, stack });
  const error = winston.format(info =>
    info instanceof Error ? { ...info, ...extractError(info) } : info
  );
  const defaults = winston.format((info) => ({
    ...info,
    source: 'ssr-server',
    requestId: requestId.get(),
  }));
  return combine(error(), defaults(), winston.format.json());
}

function getDevFormat() {
  const error = info => prettyError.render(info);
  const noPrefix = info => info.message;
  const message = info => `${info.level} ${info.message}`;
  const format = info =>
    info instanceof Error ? error(info) : info.prefix === false ? noPrefix(info) : message(info);
  return combine(colorize(), printf(format));
}

module.exports = logger;
