export type FormulaVariableValue = any;

export interface CustomFieldVariableValue {
    type: string;
    value: FormulaVariableValue;
}

export interface CustomFieldVariable extends CustomFieldVariableValue {
    id: string;
}

const CUSTOM_FIELD_REGEX = 'CUSTOM_FIELD_(.*)';
const getCustomFieldRegex = () => new RegExp(/CUSTOM_FIELD_(.*)/, 'g');

const createCustomFieldVariable = (id: string, type: string, value: FormulaVariableValue): CustomFieldVariable => ({
    id,
    type,
    value,
});

const isCustomFieldVariableValue = (value: unknown): value is CustomFieldVariableValue => {
    return (
        value !== undefined &&
        value !== null &&
        typeof value === 'object' &&
        'type' in value &&
        typeof value.type === 'string' &&
        'value' in value
    );
};

export function isCustomFieldVariable(name: string): boolean {
    return getCustomFieldRegex().test(name);
}

export function getCustomFieldVariable(name: string, value: unknown): CustomFieldVariable | undefined {
    const match = getCustomFieldRegex().exec(name);
    if (match && match[1] && isCustomFieldVariableValue(value)) {
        return createCustomFieldVariable(match[1], value.type, value.value);
    }
    return undefined;
}
