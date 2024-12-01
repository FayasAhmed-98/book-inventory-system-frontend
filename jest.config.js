module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Required for React tests
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest', // Use Babel to transform TypeScript and TSX files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@testing-library/react)/', // Include specific node modules to be transpiled
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true, // For faster compilation with TypeScript
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Reference the setup file
};
