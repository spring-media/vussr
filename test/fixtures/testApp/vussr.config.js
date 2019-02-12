const { client, server, devServer } = require('./webpack');

function getJest() {
  if (typeof jest !== 'undefined') return jest;
  return { fn: () => ({ mockImplementation: fn => fn }) };
}

const beforeMiddleware = getJest()
  .fn()
  .mockImplementation((req, res, next) => {
    next();
  });

const afterMiddleware = getJest()
  .fn()
  .mockImplementation((req, res, next) => {
    next();
  });

const before = [beforeMiddleware];
const after = [afterMiddleware];
const middleware = { before, after };
const options = { middleware, client, server, devServer };

module.exports.beforeMiddleware = beforeMiddleware;
module.exports.afterMiddleware = afterMiddleware;
module.exports.options = options;
