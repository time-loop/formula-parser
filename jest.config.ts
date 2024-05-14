import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['./test'],
    setupFilesAfterEnv: ['./test/jest.setup.ts'],
    testRegex: '(/test/.*.ts)$',
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/test/jest.setup.ts', '/test/jest.d.ts'],
    collectCoverageFrom: ['**/*.ts', '!src/grammar-parser/**'],
};

export default config;
