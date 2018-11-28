const logger = require("./logger");

const DEFAULT_ERR_STATUS = 500;

function defaultErrorHandler(err, req, res, next) {
  if (err.code === 404) return next(); // todo remove me
  logger.error(err);
  res.sendStatus(err.statusCode || DEFAULT_ERR_STATUS);
}

function renderApp(render, errorHandler=defaultErrorHandler) {
  return async (req, res, next) => {
    try {
      const html = await render(req.context);
      res.end(html);

    } catch (err) {
      errorHandler(err, req, res, next);
    }
  };
};

module.exports = function(app, config, render, errorHandler=defaultErrorHandler){
  app.use(
    (req, _, next) => {
      const appContext = {
        url: req.originalUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        mobile: req.subdomains.indexOf("m") !== -1,
        desktop: req.subdomains.indexOf("m") === -1
      };
      const serverContext = {};
      req.context = { appContext, serverContext }
      next();
    },
    ...config.middlewares.before, 
    renderApp(render, errorHandler),
    ...config.middlewares.after, 
  );
};
