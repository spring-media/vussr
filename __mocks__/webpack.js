const instance = {
  run: jest.fn(),
}

module.exports = jest.fn(() => instance);
module.exports.instance = instance;