const { createLogger, format, transports } = require('winston');
const { combine, label, colorize, printf } = format;
const { isProd } = require('../utils/env');

function prodFormat() {
  const replaceError = ({ label, level, message, stack }) => ({ label, level, message, stack });
  const replacer = (key, value) => value instanceof Error ? replaceError(value) : value;
  return combine(label({ label: 'ssr server log' }), format.json({ replacer }));
}

function devFormat() {
  const formatMessage = info => `${info.level} ${info.message}`;
  const formatError = info => `${info.level} ${info.message}\n\n${info.stack}\n`;
  const format = info => info instanceof Error ? formatError(info) : formatMessage(info);
  return combine(colorize(), printf(format))
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  exitOnError: false,
  transports: [new transports.Console()],
  format: isProd ? prodFormat() : devFormat(),
});

module.exports = logger;