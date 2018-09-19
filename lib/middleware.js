const logger = require('./logger');

module.exports = render => async (req, res, next) => {
  try {
    const html = await render(req.originalUrl)
    res.end(html);
  } catch (err) {
    if (err.code === 404) return next();
    logger.error(err);
    res.sendStatus(500);
  }
}
