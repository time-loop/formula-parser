import {
    createCustomFieldVariable,
    getCustomFieldVariable,
    isCustomFieldVariableName,
} from '../../../src/clickup/customField';

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
                __isCustomFieldVariableValue: true,
                name: 'CUSTOM_FIELD_1',
                type: 'unknown',
                value: { type: 'number', value: 10 },
            },
        ],
        [
            'variable is missing the type',
            'CUSTOM_FIELD_2',
            { value: 10 },
            { __isCustomFieldVariableValue: true, name: 'CUSTOM_FIELD_2', type: 'unknown', value: { value: 10 } },
        ],
        [
            'variable is missing the value',
            'CUSTOM_FIELD_3',
            { type: 'number' },
            { __isCustomFieldVariableValue: true, name: 'CUSTOM_FIELD_3', type: 'unknown', value: { type: 'number' } },
        ],
        [
            'variable is not defined',
            'CUSTOM_FIELD_4',
            undefined,
            { __isCustomFieldVariableValue: true, name: 'CUSTOM_FIELD_4', type: 'unknown', value: undefined },
        ],
        [
            'variable is null', // null is a valid value
            'CUSTOM_FIELD_5',
            null,
            { __isCustomFieldVariableValue: true, name: 'CUSTOM_FIELD_5', type: 'unknown', value: null },
        ],
        [
            'variable is of expected type',
            'CUSTOM_FIELD_6',
            createCustomFieldVariable('CUSTOM_FIELD_6', 2137, 'number'),
            { __isCustomFieldVariableValue: true, name: 'CUSTOM_FIELD_6', type: 'number', value: 2137 },
        ],
    ])('correctly extracts field value when %s', (_, variable, value, expected) => {
        const result = getCustomFieldVariable(variable, value);
        expect(result).toEqual(expected);
    });
});
