import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ['**/*\\{.,-}min.js', 'src/grammar-parser/grammar-parser.js', '**/dist/'],
    },
    ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },

            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },

        rules: {},
    },
    {
        files: ['test/**/*'],

        rules: {
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
