const { nockMiddleware, replayNocks } = require('express-nock');

module.exports = function nock(mode) {
  if (mode === 'record') return nockMiddleware({ nockPath });
  if (mode === 'replay') return replayNocks({ nockPath });
  return (req, res, next) => next();
};