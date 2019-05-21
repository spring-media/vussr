const uuidv4 = require('uuid/v4');

let reqId = null;

/**
 * Express.js middleware
 * responsible for initializing and saving the request id
 * @return {function} express middleware
 **/
const middleware = () => {
	return (req, res, next) => {
		reqId = uuidv4();
    console.log('Initialized: ', reqId);
		next();
	};
};

/**
 * Gets the request id
 * Will return nothing if the context has not yet been initialized
 * for this request or if there is no value present.
 * @return {String} the current request id
 **/
function get () {
  if (reqId) {
    return reqId;
  }
}

module.exports = { middleware, get };
