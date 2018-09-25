const logger = require("./logger");

const DEFAULT_ERR_STATUS = 500;

function defaultErrorHandler(err, req, res, next) {
  logger.error(err);
  res.sendStatus(err.statusCode || DEFAULT_ERR_STATUS);
}

function getContext(req) {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const url = req.originalUrl;
  return { url, fullUrl };
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
