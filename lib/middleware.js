const logger = require("./logger");

const DEFAULT_ERR_STATUS = 500;

function defaultErrorHandler(err, req, res, next) {
  if (err.code === 404) return next(); // todo remove me
  logger.error(err);
  res.sendStatus(err.statusCode || DEFAULT_ERR_STATUS);
}

function getServerContext(middlewares){
  let pluginMiddleware = (middleware) => {
    middlewares.push(middleware);
  }

  return { pluginMiddleware }
}

function getAppContext(req) {
  const url = req.originalUrl;
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const mobile = req.subdomains.indexOf("m") !== -1;
  const desktop = req.subdomains.indexOf("m") === -1;

  let datastore = {}
  let addToRequestDataStore = (key, data) => {
    datastore[key] = data;
  }

  return { url, fullUrl, mobile, desktop, datastore, addToRequestDataStore };
}

module.exports = (render, errorHandler = defaultErrorHandler) => async (req, res, next) => {
  let middlewares = [];
  
  try {
    const appContext = getAppContext(req);
    const serverContext = getServerContext(middlewares);
    const html = await render({serverContext, appContext});
    middlewares.forEach(function (middleware) {
      middleware(req, res, appContext);
    });
    res.end(html);
  } catch (err) {
    errorHandler(err, req, res, next);
  }
};
