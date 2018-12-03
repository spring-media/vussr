const logger = require('../logger');

module.exports = function errorHandler() {
  return (err, req, res, next) => {
    if (!err) return next();
    if (err.statusCode === 404) return next(); // TODO this is code for the dev server and it must be removed
    logger.error(err);
    res.sendStatus(err.statusCode || 500);
  };
};
