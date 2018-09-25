const fs = jest.genMockFromModule('fs');

fs.realpathSync = jest.fn(() => '/mocked/path/');

module.exports = fs;