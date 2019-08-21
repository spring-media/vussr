const { client, server, devServer } = require('./webpack');
const path = require('path');

const resolveApp = relativePath => path.resolve(__dirname, relativePath);

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
const outputPath = resolveApp('./dist/');
const options = { 
  outputPath, 
  middleware, 
  client, 
  server, 
  devServer,
  compressHTML: false,
  compressAssets: false,
};

module.exports.beforeMiddleware = beforeMiddleware;
module.exports.afterMiddleware = afterMiddleware;
module.exports.options = options;
