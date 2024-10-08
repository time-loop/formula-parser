import { ClickUpParser } from '../../../src/clickup/clickupParser';
import Parser from '../../../src/parser';

describe('.parse() custom function', () => {
    it.each([new Parser(), ClickUpParser.create()])('should evaluate custom functions', (parser) => {
        expect(parser.parse('foo()')).toMatchObject({ error: '#NAME?', result: null });

        parser.setFunction('ADD_5', (params) => params[0] + 5);
        parser.setFunction('GET_LETTER', (params) => {
            const string = params[0];
            const index = params[1] - 1;

            return string.charAt(index);
        });

        expect(parser.parse('SUM(4, ADD_5(1))')).toMatchObject({ error: null, result: 10 });
        expect(parser.parse('GET_LETTER("Some string", 3)')).toMatchObject({ error: null, result: 'm' });
    });

    it.each([new Parser(), ClickUpParser.create()])(
        'should evaluate function with arguments passed as an stringified array',
        (parser) => {
            expect(parser.parse('SUM([])')).toMatchObject({ error: null, result: 0 });
            expect(parser.parse('SUM([1])')).toMatchObject({ error: null, result: 1 });
            expect(parser.parse('SUM([1,2,3])')).toMatchObject({ error: null, result: 6 });
        }
    );
});
