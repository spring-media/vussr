module.exports = function sendHtml(req, res, next) {
	return (req, res, next) => {
		res.end(res.locals.body);
		next();
	};
};
