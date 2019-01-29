const maxTime = 2;
const lowerTime = 1;

const statsJson = {
  errors: [],
  warnings: [],
  children: [{ time: maxTime }, { time: lowerTime }],
};

const hasErrors = false;

const stats = {
  toJson: jest.fn(() => statsJson),
  hasErrors: jest.fn(() => hasErrors),
};

const instance = {
  run: jest.fn(fn => fn(null, stats)),
};

const webpack = jest.fn(() => instance);
webpack.NormalModuleReplacementPlugin = jest.fn();

module.exports = webpack;
module.exports.instance = instance;
module.exports.stats = stats;
module.exports.maxTime = maxTime;
