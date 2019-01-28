const recordMiddleware = jest.fn();
const replayMiddleware = jest.fn();

module.exports.nockMiddleware = jest.fn().mockReturnValue(recordMiddleware);
module.exports.replayNocks = jest.fn().mockReturnValue(replayMiddleware);
module.exports.recordMiddleware = recordMiddleware;
module.exports.replayMiddleware = replayMiddleware;
