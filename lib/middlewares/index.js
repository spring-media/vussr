const setContext = require('./setContext');
const runApp = require('./runApp');
const sendHtml = require('./sendHtml');
const errorHandler = require('./errorHandler');

function getRenderMiddleWares(options) {
  const defaultOptions = { before: [], after: [] };
  const { renderFn, before, after } = Object.assign({}, defaultOptions, options);
  return [setContext(), ...before, runApp(renderFn), ...after, sendHtml(), errorHandler()];
}

module.exports.getRenderMiddleWares = getRenderMiddleWares;
