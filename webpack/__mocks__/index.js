const clientReturnValue = {};
const serverReturnValue = {};
const devServerReturnValue = {};

const client = jest.fn().mockReturnValue(clientReturnValue);
const server = jest.fn().mockReturnValue(serverReturnValue);
const devServer = jest.fn().mockReturnValue(devServerReturnValue);

module.exports = { client, server, devServer };
