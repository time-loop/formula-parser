export type FieldValue = any;
export type FieldId = string;

export interface CustomFieldVariableValue {
    type: string;
    value: FieldValue;
}

export interface CustomFieldVariable extends CustomFieldVariableValue {
    id: FieldId;
}

export function getCustomFieldRegex() {
    return new RegExp(/CUSTOM_FIELD_([a-zA-Z0-9_]+)/, 'g');
}

export const restoreFieldIdFromName = (name: string) => name.replace(getCustomFieldRegex(), '').replace('_', '-');

function createCustomFieldVariable(id: string, type: string, value: FieldValue): CustomFieldVariable {
    return {
        id,
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
    const match = getCustomFieldRegex().exec(name);
    if (match && isCustomFieldVariableValue(value)) {
        return createCustomFieldVariable(restoreFieldIdFromName(name), value.type, value.value);
    }
    return undefined;
}
