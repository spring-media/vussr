const handler = jest.fn().mockImplementation((req, res, next) => next());
const generator = jest.fn().mockImplementation(() => handler);

module.exports = generator;
module.exports.handler = handler;
