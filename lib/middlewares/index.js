const writeAccessLogs = require('./writeAccessLogs');
const setContext = require('./setContext');
const runApp = require('./runApp');
const sendHtml = require('./sendHtml');
const errorHandler = require('./errorHandler');

function getRenderMiddleWares({ renderFn, before = [], after = [], accessLogs }) {
  return [
    writeAccessLogs(accessLogs),
    setContext(),
    ...before,
    runApp(renderFn),
    ...after,
    sendHtml(),
    errorHandler()
  ];
}

module.exports.getRenderMiddleWares = getRenderMiddleWares;
