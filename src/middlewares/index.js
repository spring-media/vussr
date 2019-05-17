const writeAccessLogs = require('./accessLogs');
const setContext = require('./setContext');
const requestId = require('./requestId');
const applyNocks = require('./nock');
const runApp = require('./runApp');
const sendHtml = require('./sendHtml');
const errorHandler = require('./errorHandler');
const cookieParser = require("cookie-parser");

function getMiddleWares({ renderFn, before = [], after = [], nock, nockPath, accessLogs }) {
  return [
    cookieParser(),
    requestId.middleware(),
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
