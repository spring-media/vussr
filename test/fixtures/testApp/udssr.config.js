const { client, server, devServer } = require('./webpack');

//const beforeMiddleware = jest.fn().mockImplementation((req, res, next) => next());
//const afterMiddleware = jest.fn().mockImplementation((req, res, next) => next());
//const before = [beforeMiddleware];
//const after = [afterMiddleware];
const before = [];
const after = [];
const middleware = { before, after };
const options = { middleware, client, server, devServer };

//module.exports.beforeMiddleware = beforeMiddleware;
//module.exports.afterMiddleware = afterMiddleware;
module.exports.options = options;
