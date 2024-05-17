import { getCustomFieldVariable, isCustomFieldVariable } from '../../../src/clickup/customField';

describe('custom field functions', () => {
    it.each([
        ['CUSTOM_FIELD_1', true],
        ['SOME_OTHER_VARIABLE', false],
    ])('variable %s is a custom field variable: %s', (variableName, expected) => {
        expect(isCustomFieldVariable(variableName)).toBe(expected);
    });

    it.each([
        [
            'value is correct',
            'CUSTOM_FIELD_123',
            { type: 'number', value: 10 },
            { name: 'CUSTOM_FIELD_123', type: 'number', value: 10 },
        ],
        ['variable is missing the type', 'CUSTOM_FIELD_123', { value: 10 }, undefined],
        ['variable is missing the value', 'CUSTOM_FIELD_123', { type: 'number' }, undefined],
        ['variable is not defined', 'CUSTOM_FIELD_123', undefined, undefined],
        ['variable is null', 'CUSTOM_FIELD_123', null, undefined],
    ])('correctly extracts field value when %s', (_, variable, value, expected) => {
        const result = getCustomFieldVariable(variable, value);
        expect(result).toEqual(expected);
    });
});
