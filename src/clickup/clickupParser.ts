import Parser from '../parser';
import { CustomFieldVariable, getCustomFieldVariable, isCustomFieldVariable } from './customField';

import { ParseResult } from './parseResult';

export class ClickUpParser {
    private parser = new Parser();
    private customFieldVariables: Record<string, CustomFieldVariable> = {};

    private constructor() {
        this.parser.setVariable('true', true);
        this.parser.setVariable('false', false);
        this.parser.setVariable('null', null);
        this.parser.on('callVariable', (name: string, done: (newValue: unknown) => void) =>
            done(this.getCustomFieldVariableValue(name))
        );
    }

    private getCustomFieldVariableValue(name: string) {
        const variable = this.customFieldVariables[name];
        if (variable) {
            switch (variable.type) {
                case 'formula':
                    return this.parse(variable.value);
                default:
                    return variable.value;
            }
        }
        return undefined;
    }

    static create() {
        return new ClickUpParser();
    }

    parse(expression: string): ParseResult {
        // iterate through the expression and find all CU variables
        // check each variable if it is a nested formula and build deps tree
        return this.parser.parse(expression);
    }

    setVariable(name: string, value: any) {
        if (isCustomFieldVariable(name)) {
            const customFieldVariable = getCustomFieldVariable(name, value);
            if (customFieldVariable) {
                this.customFieldVariables[name] = customFieldVariable;
            } else {
                // todo: rething if we should throw an error here
                throw new Error(`Invalid custom field variable: ${name}`);
            }
        } else {
            this.parser.setVariable(name, value);
        }
        return this;
    }

    getVariable(name: string) {
        return this.parser.getVariable(name);
    }

    setFunction(name: string, fn: Function) {
        this.parser.setFunction(name, fn);
        return this;
    }

    getFunction(name: string) {
        return this.parser.getFunction(name);
    }
}
