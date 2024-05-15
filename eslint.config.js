const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const jestlint = require('eslint-plugin-jest');

module.exports = tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    jestlint.configs['flat/recommended'],
    {
        ignores: ['nodde_modules/', 'src/grammar-parser/grammar-parser.js'],
    },
    {
        files: ['test/**/*'],
        rules: {
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    }
);
