module.exports = function runApp(renderFn) {
  return async (req, res, next) => {
    try {
      res.locals.body = await renderFn(res.locals.appContext);
      next();
    } catch (err) {
      next(err);
    }
  };
};
