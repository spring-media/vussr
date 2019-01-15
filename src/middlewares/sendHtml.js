module.exports = function sendHtml() {
  return (req, res, next) => {
    res.end(res.locals.body);
    next();
  };
};
