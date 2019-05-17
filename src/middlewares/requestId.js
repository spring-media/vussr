const cls = require('cls-hooked');
const uuidv4 = require('uuid/v4');

const nsid = uuidv4();
const ns = cls.createNamespace(nsid);

/**
 * Express.js middleware
 * responsible for initializing the context for each request
 * Adds the request ID to the context
 **/
const middleware = () => {
	return (req, res, next) => {
		ns.run(() => {
			if (ns && ns.active) {
				ns.set('reqId', uuidv4());
			}
			next();
		});
	}
}

/**
 * Gets the request id from the context by key
 * Will return undefined if the context has not yet been initialized
 * for this request or if a value is not found for the specified key.
 **/
function get() {
	if (ns && ns.active) {
		return ns.get('reqId');
	}
}

module.exports = { middleware, get };
