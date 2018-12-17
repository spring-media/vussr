const { nockMiddleware, replayNocks } = require('express-nock');

function applyMiddlewares({ before = [], after = [] }, record, nockPath) {
  if (record) {
    before.unshift(nockMiddleware({ nockPath }));
  } else {
    replayNocks({ nockPath });
  }
  return { before, after };
}

module.exports = {
  applyMiddlewares,
}