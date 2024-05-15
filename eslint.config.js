// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jestlint from 'eslint-plugin-jest';

export default tseslint.config(
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
