const client = require('./webpack.config.client');
const server = require('./webpack.config.server');
const devServer = require('./webpack.config.server.dev');

function beforeHack(req, res, next) {
  const err404 = new Error('404 Not Found');
  err404.statusCode = 404;
  if (req.originalUrl !== '/') console.log('skipping', req.originalUrl)
  if (req.originalUrl !== '/') return next(err404);
  next();
}

module.exports = { client, server, devServer, middlewares: { before: [beforeHack] } };
