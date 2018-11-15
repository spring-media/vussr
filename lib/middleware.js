const logger = require("./logger");

const DEFAULT_ERR_STATUS = 500;

function defaultErrorHandler(err, req, res, next) {
  if (err.code === 404) return next(); // todo remove me
  logger.error(err);
  res.sendStatus(err.statusCode || DEFAULT_ERR_STATUS);
}

function getContext(req) {
  const url = req.originalUrl;
  const host = req.get("host");
  const fullUrl = `${req.protocol}://${host}${req.originalUrl}`;
  const mobile = req.subdomains.indexOf("m") !== -1;
  const desktop = req.subdomains.indexOf("m") === -1;
  // TODO Merge {url, fullUrl, host} to location object
  return { url, fullUrl, mobile, desktop, host };
}

module.exports = (render, errorHandler = defaultErrorHandler) => async (req, res, next) => {
  try {
    const context = getContext(req);
    const html = await render(context);
    res.end(html);
  } catch (err) {
    errorHandler(err, req, res, next);
  }
};
