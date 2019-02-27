const { nockMiddleware, replayNocks } = require('express-nock');

module.exports = function nock(mode, nockPath) {
  if (mode === 'replay') replayNocks({ nockPath });
  if (mode === 'record') return nockMiddleware({ nockPath });
  return (req, res, next) => next();
};
