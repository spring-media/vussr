const setContext = require('./setContext');
const setHtml = require('./setHtml');
const sendHtml = require('./sendHtml');
const errorHandler = require('./errorHandler');

function getRenderMiddleWares(options) {
	const defaultOptions = { before: [], after: [] };
	const { renderFn, before, after } = Object.assign({}, defaultOptions, options);
	return [setContext(), ...before, setHtml(renderFn), ...after, sendHtml(), errorHandler()];
}

module.exports.getRenderMiddleWares = getRenderMiddleWares;
