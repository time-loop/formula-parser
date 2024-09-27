/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./test/jest.setup.js'],
    transform: {
        '^.+\\.[tj]s$': 'ts-jest',
    },
    transformIgnorePatterns: ['^.+/.js$'],
    testRegex: '/test/unit/clickup/clickupFieldsDependencyTracker.perf.test.ts$',
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/test/_utils/', '/test/scripts', '/test/jest.setup.js'],
    collectCoverageFrom: ['**/*.[tj]s', '!src/grammar-parser/**'],
};

process.env.TZ = 'UTC';

module.exports = config;
