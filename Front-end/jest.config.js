module.exports = {
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.jsx$': 'babel-jest',
      },
      moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/fileMock.js"
      },
      setupFilesAfterEnv: ['<rootDir>/test-setup/setup.js'],
  };
  