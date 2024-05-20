import { ERROR_CYCLE, ERROR_LEVEL } from '../error';
import Parser from '../parser';
import {
    CustomFieldVariable,
    FieldName,
    FieldValue,
    getCustomFieldVariable,
    isCustomFieldVariableName,
} from './customField';

import { ParseResult } from './parseResult';

interface EvaluationContext {
    evaluating: Set<FieldName>;
    level: number;
    maxLevels: number;
}

function createEvaluationContext(maxLevels: number): EvaluationContext {
    return {
        evaluating: new Set<FieldName>(),
        level: 0,
        maxLevels,
    };
}

interface ClickUpParserConfig {
    maxLevels: number;
}

export class ClickUpParser {
    private parser = new Parser();
    private customFieldVariables: Record<FieldName, CustomFieldVariable> = {};
    private config: ClickUpParserConfig;
    private evaluationContext: EvaluationContext;

    private constructor(config: ClickUpParserConfig) {
        this.config = config;
        this.parser.on('callVariable', this.getCustomFieldVariableValueRetriever(this.customFieldValueGet.bind(this)));
    }

    private getCustomFieldVariableValueRetriever(evaluate: (name: FieldName) => FieldValue) {
        return (name: FieldName, done: (newValue: unknown) => void) => {
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

    private customFieldValueGet(name: FieldName): FieldValue {
        const fieldDefinition = this.customFieldVariables[name];
        if (!fieldDefinition) {
            return undefined;
        }
        if (fieldDefinition.type === 'formula') {
            return this.parser.parse(fieldDefinition.value);
        }
        return fieldDefinition.value;
    }

    static create(maxLevels: number = 1) {
        const parser = new ClickUpParser({ maxLevels });
        parser.setVariable('true', true);
        parser.setVariable('false', false);
        parser.setVariable('null', null);
        return parser;
    }

    parse(expression: string): ParseResult {
        this.evaluationContext = createEvaluationContext(this.config.maxLevels);
        return this.parser.parse(expression);
    }

    setVariable(name: FieldName, value: FieldValue) {
        if (isCustomFieldVariableName(name)) {
            this.customFieldVariables[name] = getCustomFieldVariable(name, value);
        } else {
            this.parser.setVariable(name, value);
        }
        return this;
    }

    getVariable(name: FieldName) {
        return this.parser.getVariable(name);
    }

    setFunction(name: string, fn: (...args: unknown[]) => unknown) {
        this.parser.setFunction(name, fn);
        return this;
    }

    getFunction(name: string) {
        return this.parser.getFunction(name);
    }

    on(eventName: string, callback, context = null) {
        this.parser.on(eventName, callback, context);
        return this;
    }
}
