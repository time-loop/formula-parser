import { ParseResult } from './parseResult';
import Parser from '../parser';

export class ClickUpParser {
    private parser = new Parser();

    private constructor() {
        this.parser.setVariable('true', true);
        this.parser.setVariable('false', false);
        this.parser.setVariable('null', null);
    }

    static create() {
        return new ClickUpParser();
    }

    parse(expression: string) {
        // iterate through the expression and find all CU variables
        // check each variable if it is a nested formula and build deps tree
        const { error, result } = this.parser.parse(expression);
        return new ParseResult(error, result);
    }

    setVariable(name: string, value: any) {
        this.parser.setVariable(name, value);
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
