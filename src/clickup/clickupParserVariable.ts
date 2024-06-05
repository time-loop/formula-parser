// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VariableValue = any;
export type VariableName = string;

export interface ClickUpParserVariableValue {
    isFormula?: boolean;
    value?: VariableValue | null;
}

export interface ClickUpParserVariable extends ClickUpParserVariableValue {
    name: VariableName;
}

export function createClickUpParserVariable(
    name: VariableName,
    value: VariableValue,
    isFormula = false
): ClickUpParserVariable {
    return { name, value, isFormula };
}

export const CUSTOM_FIELD_REGEX = /CUSTOM_FIELD_[a-zA-Z0-9_]+/g;
