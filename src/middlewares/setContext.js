module.exports = function setContext() {
  return (req, res, next) => {
    res.locals.context = {
      url: req.originalUrl,
      fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      mobile: req.subdomains.indexOf('m') !== -1, // TODO this belongs to the app rather than to UDSSR
      desktop: req.subdomains.indexOf('m') === -1, // TODO this belongs to the app rather than to UDSSR
    };
    next();
  };
};
