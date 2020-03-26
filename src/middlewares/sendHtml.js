var etag = require('etag');

module.exports = function sendHtml() {
  return (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('ETag', etag(res.locals.body));
      res.end(res.locals.body);
    } catch (err) {
      next(err);
    }
  };
};
