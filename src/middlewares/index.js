const writeAccessLogs = require('./accessLogs');
const setContext = require('./setContext');
const applyNocks = require('./nock');
const runApp = require('./runApp');
const sendHtml = require('./sendHtml');
const errorHandler = require('./errorHandler');
const cookieParser = require("cookie-parser");

function getMiddleWares({ renderFn, before = [], after = [], nock, nockPath, accessLogs }) {
  return [
    cookieParser(),
    writeAccessLogs(accessLogs),
    setContext(),
    applyNocks(nock, nockPath),
    ...before,
    runApp(renderFn),
    ...after,
    sendHtml(),
    errorHandler(),
  ];
}

module.exports = getMiddleWares;
