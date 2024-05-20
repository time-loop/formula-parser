import { getCustomFieldVariable, isCustomFieldVariableName } from '../../../src/clickup/customField';

describe('custom field functions', () => {
    it.each([
        ['CUSTOM_FIELD_1', true],
        ['SOME_OTHER_VARIABLE', false],
    ])('variable %s is a custom field variable name: %s', (variableName, expected) => {
        expect(isCustomFieldVariableName(variableName)).toBe(expected);
    });

    it.each([
        [
            'value is correct',
            'CUSTOM_FIELD_1',
            { type: 'number', value: 10 },
            {
                name: 'CUSTOM_FIELD_1',
                type: 'number',
                value: 10,
            },
        ],
        [
            'variable is missing the type',
            'CUSTOM_FIELD_2',
            { value: 10 },
            { name: 'CUSTOM_FIELD_2', type: 'unknown', value: { value: 10 } },
        ],
        [
            'variable is missing the value',
            'CUSTOM_FIELD_3',
            { type: 'number' },
            { name: 'CUSTOM_FIELD_3', type: 'number', value: undefined },
        ],
        [
            'variable is not defined',
            'CUSTOM_FIELD_4',
            undefined,
            { name: 'CUSTOM_FIELD_4', type: 'unknown', value: undefined },
        ],
        [
            'variable is null', // null is a valid value
            'CUSTOM_FIELD_5',
            null,
            { name: 'CUSTOM_FIELD_5', type: 'unknown', value: null },
        ],
    ])('correctly extracts field value when %s', (_, variable, value, expected) => {
        const result = getCustomFieldVariable(variable, value);
        expect(result).toEqual(expected);
    });
});
