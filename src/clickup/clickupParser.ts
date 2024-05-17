import { ERROR_CYCLE, ERROR_LEVEL, ERROR_MISSING, ERROR_VARIABLE, default as createError } from '../error';
import Parser from '../parser';
import { CustomFieldVariable, FieldId, FieldValue, getCustomFieldVariable, isCustomFieldVariable } from './customField';

import { ParseResult } from './parseResult';

interface EvaluationContext {
    evaluating: Set<FieldId>;
    level: number;
    maxLevels: number;
}

function createEvaluationContext(maxLevels: number): EvaluationContext {
    return {
        evaluating: new Set<FieldId>(),
        level: 0,
        maxLevels,
    };
}

interface ClickUpParserConfig {
    maxLevels: number;
}

export class ClickUpParser {
    private parser = new Parser();
    private customFieldVariables: Record<string, CustomFieldVariable> = {};
    private config: ClickUpParserConfig;
    private evaluationContext: EvaluationContext;

    private constructor(config: ClickUpParserConfig) {
        this.parser.setVariable('true', true);
        this.parser.setVariable('false', false);
        this.parser.setVariable('null', null);
        this.config = config;
        this.parser.on('callVariable', this.getCustomFieldVariableValueRetriever(this.customFieldValueGet.bind(this)));
    }

    private getCustomFieldVariableValueRetriever(evaluate: (name: string) => FieldValue) {
        return (name: string, done: (newValue: unknown) => void) => {
            // check if we are not in a cycle
            if (this.evaluationContext.evaluating.has(name)) {
                throw new Error(ERROR_CYCLE);
            }

            // change context
            this.evaluationContext.evaluating.add(name);
            this.evaluationContext.level++;

            // check if we are not exceeding the max levels
            if (this.evaluationContext.level > this.evaluationContext.maxLevels) {
                throw new Error(ERROR_LEVEL);
            }

            // evalue the variable
            const value = evaluate(name);

            // restore context
            this.evaluationContext.evaluating.delete(name);
            this.evaluationContext.level--;

            done(value);
        };
    }

    private customFieldValueGet(name: string): FieldValue {
        const fieldDefinition = this.customFieldVariables[name];
        if (!fieldDefinition) {
            throw new Error(ERROR_MISSING);
        }
        if (fieldDefinition.type === 'formula') {
            return this.parser.parse(fieldDefinition.value);
        }
        return fieldDefinition.value;
    }

    static create(maxLevels: number = 1) {
        return new ClickUpParser({ maxLevels });
    }

    parse(expression: string): ParseResult {
        this.evaluationContext = createEvaluationContext(this.config.maxLevels);
        return this.parser.parse(expression);
    }

    setVariable(name: string, value: any) {
        if (isCustomFieldVariable(name)) {
            const customFieldVariable = getCustomFieldVariable(name, value);
            if (customFieldVariable) {
                this.customFieldVariables[name] = customFieldVariable;
            } else {
                throw new Error(String(createError(ERROR_VARIABLE)));
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
