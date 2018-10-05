const logger = require('./logger');

function getContext(req) {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const url = req.originalUrl;
  return { url, fullUrl };
}

module.exports = render => async (req, res, next) => {
  try {
    const context = getContext(req);
    const html = await render(context);
    res.end(html);
  } catch (err) {
    if (err.code === 404) return next();
    logger.error(err);
    res.sendStatus(500);
  }
}
