const fs = jest.genMockFromModule('fs');

fs.realpathSync = jest.fn(() => '/mocked/realpathSync/');

module.exports = fs;