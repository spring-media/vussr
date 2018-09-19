const { createLogger, format, transports } = require('winston');
const { combine, colorize, printf } = format;

const formatMessage = info => `${info.level} ${info.message}`;
const formatError = info => `${info.level} ${info.message}\n\n${info.stack}\n`;
const logFormat = printf(info => info instanceof Error ? formatError(info) : formatMessage(info));

const logger = createLogger({
  level: 'info',
  exitOnError: false,
  transports: [
    new transports.Console()
  ],
  format: combine(
    colorize(),
    logFormat
    ),
});

module.exports = logger;