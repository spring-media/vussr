module.exports = function runApp(renderFn) {
  return async (req, res, next) => {
    try {
      res.locals.body = await renderFn(res.locals.context);
      next();
    } catch (err) {
      next(err);
    }
  };
};
