const { get: getRequestId } = require('./requestId');

module.exports = function setContext() {
  return (req, res, next) => {
    const requestId = getRequestId();
    res.locals.context = {
      url: req.originalUrl,
      fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      mobile: req.subdomains.indexOf('m') !== -1, // TODO this belongs to the app rather than to vussr
      desktop: req.subdomains.indexOf('m') === -1, // TODO this belongs to the app rather than to vussr
      ...(requestId ? { requestId } : null),
    };
    next();
  };
};
