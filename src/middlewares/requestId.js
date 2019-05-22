const uuidv4 = require('uuid/v4');

let requestId = null;

/**
 * Express.js middleware
 * responsible for initializing and saving the request id
 * @return {function} express middleware
 **/
function middleware() {
	return (req, res, next) => {
		requestId = uuidv4();
		next();
	};
};

/**
 * Gets the request id
 * Will return nothing if the context has not yet been initialized
 * for this request or if there is no value present.
 * @return {String} the current request id
 **/
function get() {
  if (requestId) {
    return requestId;
  }
}

module.exports = { middleware, get };
