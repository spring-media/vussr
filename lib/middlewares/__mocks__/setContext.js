const handler = jest.fn();
const generator = jest.fn().mockImplementation(() => handler);

module.exports = generator;
module.exports.handler = handler;
