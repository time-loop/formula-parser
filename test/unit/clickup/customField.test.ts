import { getClickUpParserVariable } from '../../../src/clickup/clickupParserVariable';

describe('custom field functions', () => {
    it.each([
        [
            'value is correct',
            'VARIABLE_1',
            { type: 'number', value: 10 },
            {
                name: 'VARIABLE_1',
                type: 'number',
                value: 10,
            },
        ],
        [
            'variable is missing the type',
            'VARIABLE_2',
            { value: 10 },
            { name: 'VARIABLE_2', type: 'unknown', value: { value: 10 } },
        ],
        [
            'variable is missing the value',
            'VARIABLE_3',
            { type: 'number' },
            { name: 'VARIABLE_3', type: 'number', value: undefined },
        ],
        ['variable is not defined', 'VARIABLE_4', undefined, { name: 'VARIABLE_4', type: 'unknown', value: undefined }],
        [
            'variable is null', // null is a valid value
            'VARIABLE_5',
            null,
            { name: 'VARIABLE_5', type: 'unknown', value: null },
        ],
        [
            'variable is a formula',
            'VARIABLE_6',
            { type: 'formula', value: '10 + 20' },
            { name: 'VARIABLE_6', type: 'formula', value: '10 + 20' },
        ],
    ])('correctly extracts field value when %s', (_, variable, value, expected) => {
        const result = getClickUpParserVariable(variable, value);
        expect(result).toEqual(expected);
    });
});
