// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VariableValue = any;
export type VariableName = string;

export interface ClickUpParserVariableValue {
    type: string;
    value?: VariableValue | null;
}

export interface ClickUpParserVariable extends ClickUpParserVariableValue {
    name: VariableName;
}

export const CUSTOM_FIELD_REGEX = /CUSTOM_FIELD_[a-zA-Z0-9_]+/g;

function isClickUpParserVariableValue(value: unknown): value is ClickUpParserVariableValue {
    return typeof value === 'object' && value !== null && 'type' in value && typeof value.type === 'string';
}

export function createClickUpParserVariable(
    name: string,
    value: VariableValue,
    type: string = 'unknown'
): ClickUpParserVariable {
    return {
        name,
        type,
        value,
    };
}

export function getClickUpParserVariable(name: string, value: unknown): ClickUpParserVariable {
    return isClickUpParserVariableValue(value)
        ? createClickUpParserVariable(name, value.value, value.type)
        : createClickUpParserVariable(name, value);
}
