module.exports = function sendHtml() {
  return (req, res, next) => {
    try {
      res.end(res.locals.body);
    } catch (err) {
      next(err);
    }
  };
};
