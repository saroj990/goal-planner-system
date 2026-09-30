/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  setupFiles: ['<rootDir>/../test/jest.env.ts'],
  testRegex: '.*\\.spec\\.ts$',
  testTimeout: 30000,
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/../tsconfig.spec.json',
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
