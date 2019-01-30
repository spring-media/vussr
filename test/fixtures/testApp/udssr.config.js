const { client, server, devServer } = require('./webpack');

// const jest = { fn: () => ({ mockImplementation: () => ({}) }) };

const beforeMiddleware = jest.fn().mockImplementation((req, res, next) => {
  console.log('beforeMiddleware');
  next();
});

const afterMiddleware = jest.fn().mockImplementation((req, res, next) => {
  console.log('afterMiddleware');
  next();
});

const before = [beforeMiddleware];
const after = [afterMiddleware];
const middleware = { before, after };
const options = { middleware, client, server, devServer };

module.exports.beforeMiddleware = beforeMiddleware;
module.exports.afterMiddleware = afterMiddleware;
module.exports.options = options;
