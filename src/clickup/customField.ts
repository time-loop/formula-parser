// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldValue = any;
export type FieldName = string;

export interface CustomFieldVariableValue {
    // discriminator property to allow plain objects to be treated like
    // plain Parser variables
    __isCustomFieldVariableValue: true;
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

function isCustomFieldVariableValue(value: unknown): value is CustomFieldVariableValue {
    return typeof value === 'object' && value !== null && '__isCustomFieldVariableValue' in value;
}

export function createCustomFieldVariable(
    name: string,
    value: FieldValue,
    type: string = 'unknown'
): CustomFieldVariable {
    return {
        __isCustomFieldVariableValue: true,
        name,
        type,
        value,
    };
}

export function isCustomFieldVariableName(name: string): boolean {
    return getCustomFieldRegex().test(name);
}

export function getCustomFieldVariable(name: string, value: unknown): CustomFieldVariable {
    return isCustomFieldVariableValue(value)
        ? createCustomFieldVariable(name, value.value, value.type)
        : createCustomFieldVariable(name, value);
}
