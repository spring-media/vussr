const { getAbsoluteUrl } = require('express-absolute-url');
const { get: getRequestId } = require('./requestId');

module.exports = function setContext() {
  return (req, res, next) => {
    const requestId = getRequestId();
    res.locals.context = {
      url: req.originalUrl,
      fullUrl: getAbsoluteUrl(req).toString(),
      mobile: req.subdomains.indexOf('m') !== -1, // TODO this belongs to the app rather than to vussr
      desktop: req.subdomains.indexOf('m') === -1, // TODO this belongs to the app rather than to vussr
      ...(requestId ? { requestId } : null),
    };
    next();
  };
};
