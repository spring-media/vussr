const logger = require("./logger");

const DEFAULT_ERR_STATUS = 500;

function defaultErrorHandler(err, req, res, next) {
  if (err.code === 404) return next(); // todo remove me
  logger.error(err);
  res.sendStatus(err.statusCode || DEFAULT_ERR_STATUS);
}

function getServerContext(middlewares){
  let datastore = {}

  const pluginMiddleware = (middleware) => {
    middlewares.push(middleware);
  }

  return { pluginMiddleware, datastore }
}

function getAppContext(req) {
  const url = req.originalUrl;
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const mobile = req.subdomains.indexOf("m") !== -1;
  const desktop = req.subdomains.indexOf("m") === -1;

  return { url, fullUrl, mobile, desktop, datastore, addToRequestDataStore };
}

module.exports = (render, errorHandler = defaultErrorHandler) => async (req, res, next) => {
  let middlewares = [];
  
  try {
    const appContext = getAppContext(req);
    const serverContext = getServerContext(middlewares);

    middlewares.forEach(function (middleware) {
      middleware.before(req, res, serverContext);
    });
    
    const html = await render({serverContext, appContext});
    
    middlewares.forEach(function (middleware) {
      middleware.after(req, res, serverContext);
    });

    res.end(html);
  } catch (err) {
    errorHandler(err, req, res, next);
  }
};


class Middleware { 
  constructor() { 
    if (new.target === Middleware) { 
      throw new TypeError('Cannot construct Abstract Middleware instances directly'); 
    } 
  }
  
  before(req, res, serverContext) {
    throw new TypeError('Cannot call methode from Abstract Middleware instances directly'); 
  }

  after(req, res, serverContext) {
    throw new TypeError('Cannot call methode from Abstract Middleware instances directly');
  }
}
