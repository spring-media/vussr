const logger = require('../logger');

module.exports = function errorHandler() {
  return (err, req, res, next) => {
    if (!err) return next();
    logger.error(err);
    res.sendStatus(err.statusCode || 500);
  };
};
