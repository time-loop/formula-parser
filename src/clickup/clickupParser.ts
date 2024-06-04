import { ERROR_CYCLE, ERROR_LEVEL } from '../error';
import Parser from '../parser';
import { VariableName, VariableValue, getClickUpParserVariable } from './clickupParserVariable';

import { ParseResult } from './parseResult';

interface EvaluationContext {
    evaluating: Set<VariableName>;
    level: number;
    maxLevels: number;
}

function createEvaluationContext(maxLevels: number): EvaluationContext {
    return {
        evaluating: new Set<VariableName>(),
        level: 0,
        maxLevels,
    };
}

interface ClickUpParserConfig {
    maxLevels: number;
}

export class ClickUpParser {
    private parser = new Parser();
    private config: ClickUpParserConfig;
    private evaluationContext: EvaluationContext;

    private constructor(config: ClickUpParserConfig) {
        this.config = config;
        this.parser.on('callVariable', this.getCustomFieldVariableValueRetriever(this.customFieldValueGet.bind(this)));
    }

    private getCustomFieldVariableValueRetriever(evaluate: (name: VariableName) => VariableValue) {
        return (name: VariableName, done: (newValue: unknown) => void) => {
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

    private customFieldValueGet(name: VariableName): VariableValue {
        const fieldDefinition = this.parser.getVariable(name);
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

    setVariable(name: VariableName, value: VariableValue) {
        const parserVariable = getClickUpParserVariable(name, value);
        this.parser.setVariable(name, parserVariable);
        return this;
    }

    setVariables(variables: Record<VariableName, VariableValue>) {
        for (const [name, value] of Object.entries(variables)) {
            this.setVariable(name, value);
        }
        return this;
    }

    getVariable(name: VariableName) {
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
