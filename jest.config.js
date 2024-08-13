/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./test/jest.setup.js'],
    transform: {
        '^.+\\.[tj]s$': 'ts-jest',
    },
    testRegex: '(/test/.*.(t|j)s)$',
    transformIgnorePatterns: ['^.+/.js$'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/test/_utils/', '/test/scripts', '/test/jest.setup.js'],
    collectCoverageFrom: ['**/*.[tj]s', '!src/grammar-parser/**'],
};

process.env.TZ = 'UTC';

module.exports = config;
