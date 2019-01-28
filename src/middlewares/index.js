const setContext = require('./setContext');
const applyNocks = require('./nock');
const runApp = require('./runApp');
const sendHtml = require('./sendHtml');
const errorHandler = require('./errorHandler');

function getMiddleWares({ renderFn, before = [], after = [], options = {} }) {
  return [
    setContext(),
    applyNocks(options.nock, options.nockPath),
    ...before,
    runApp(renderFn),
    ...after,
    sendHtml(),
    errorHandler(),
  ];
}

module.exports = getMiddleWares;
