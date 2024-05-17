// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldValue = any;
export type FieldName = string;

export interface CustomFieldVariableValue {
    type: string;
    value: FieldValue;
}

export interface CustomFieldVariable extends CustomFieldVariableValue {
    name: FieldName;
}

export const getCustomFieldRegex = (function () {
    const CUSTOM_FIELD_REGEX = /CUSTOM_FIELD_[a-zA-Z0-9_]+/g;
    return () => {
        // make sure we start fresh for each call
        CUSTOM_FIELD_REGEX.lastIndex = 0;
        return CUSTOM_FIELD_REGEX;
    };
})();

function createCustomFieldVariable(name: string, type: string, value: FieldValue): CustomFieldVariable {
    return {
        name,
        type,
        value,
    };
}

function isCustomFieldVariableValue(value: unknown): value is CustomFieldVariableValue {
    return (
        value !== undefined &&
        value !== null &&
        typeof value === 'object' &&
        'type' in value &&
        typeof value.type === 'string' &&
        'value' in value
    );
}

export function isCustomFieldVariable(name: string): boolean {
    return getCustomFieldRegex().test(name);
}

export function getCustomFieldVariable(name: string, value: unknown): CustomFieldVariable | undefined {
    return isCustomFieldVariable(name) && isCustomFieldVariableValue(value)
        ? createCustomFieldVariable(name, value.type, value.value)
        : undefined;
}
