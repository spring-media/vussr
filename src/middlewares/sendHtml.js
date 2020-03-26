const etag = require('etag');
const logger = require('../logger.js');

module.exports = function sendHtml() {
  return (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('ETag', etag(res.locals.body));
      logger.info(`ResponseHeaders => ${JSON.stringify(res.getHeaders())}`);
      res.end(res.locals.body);
    } catch (err) {
      next(err);
    }
  };
};
