const logger = require("./logger");

const DEFAULT_ERR_STATUS = 500;

function defaultErrorHandler(err, req, res, next) {
  if (err.code === 404) return next(); // todo remove me
  logger.error(err);
  res.sendStatus(err.statusCode || DEFAULT_ERR_STATUS);
}

function getContext(req) {
  const url = req.originalUrl;
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const mobile = req.subdomains.indexOf("m") !== -1;
  const desktop = req.subdomains.indexOf("m") === -1;

  let datastore = {}
  let addDataToRequest = (key, data) => {
    datastore[key] = data;
  }

  return { url, fullUrl, mobile, desktop, datastore, addDataToRequest };
}

module.exports = (render, errorHandler = defaultErrorHandler) => async (req, res, next) => {
  try {
    const context = getContext(req);
    const html = await render(context);
    res.set({
      'Vary': 'X-Forwarded-Proto, Accept-Encoding',
      'X-CM-DocType': 'BTOArtikel',
      'X-CM-Host': context.mobile ? 'm.bild.de' : 'www.bild.de',
      'X-CM-Uri': context.fullUrl,
      'publicationDate': req.data.article.publicationDate
    });
    res.end(html);
  } catch (err) {
    errorHandler(err, req, res, next);
  }
};
