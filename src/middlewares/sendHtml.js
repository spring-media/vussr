module.exports = function sendHtml() {
  return (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'text/html');
      res.end(res.locals.body);
    } catch (err) {
      next(err);
    }
  };
};
