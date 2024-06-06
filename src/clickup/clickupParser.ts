import { ERROR_CYCLE, ERROR_LEVEL } from '../error';
import Parser from '../parser';
import { VariableName, VariableValue } from './clickupParserVariable';

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
    private formulaVariables = new Set<VariableName>();

    private constructor(config: ClickUpParserConfig) {
        this.config = config;
        this.parser.on('callVariable', this.variableValueGet.bind(this));
    }

    private variableValueGet(name: VariableName, done: (newValue?: unknown) => void) {
        // if the variable is a formula, we evaluate it
        if (this.formulaVariables.has(name)) {
            const variableValue = this.parser.getVariable(name);
            const result = this.evaluateFormulaVariable(name, variableValue);
            done(result);
            return;
        }
        done();
    }

    private evaluateFormulaVariable(name: VariableName, variableValue: VariableValue) {
        // check if we are not in a cycle
        if (this.evaluationContext.evaluating.has(name)) {
            throw new Error(ERROR_CYCLE);
        }
        // update context
        this.evaluationContext.evaluating.add(name);
        this.evaluationContext.level++;
        // check if we are not exceeding the max levels
        if (this.evaluationContext.level > this.evaluationContext.maxLevels) {
            throw new Error(ERROR_LEVEL);
        }

        const { error, result } = this.parser.parse(variableValue);

        // restore context
        this.evaluationContext.evaluating.delete(name);
        this.evaluationContext.level--;

        if (error) {
            throw new Error(error);
        }
        return result;
    }

    static create(maxLevels: number = 1) {
        return new ClickUpParser({ maxLevels });
    }

    parse(expression: string): ParseResult {
        this.evaluationContext = createEvaluationContext(this.config.maxLevels);
        return this.parser.parse(expression);
    }

    setVariable(name: VariableName, value: VariableValue, isFormula = false) {
        if (isFormula) {
            this.formulaVariables.add(name);
        }
        this.parser.setVariable(name, value);
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
