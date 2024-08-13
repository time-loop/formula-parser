import { ClickUpParser } from '../../../src/clickup/clickupParser';
import Parser from '../../../src/parser';

describe('.parse()', () => {
    it.each([new Parser(), ClickUpParser.create()])(
        'should return error when number of arguments is not valid',
        (parser) => {
            expect(parser.parse('ACOTH("foo")')).toMatchObject({ error: '#VALUE!', result: null });
            expect(parser.parse("ACOTH('foo')")).toMatchObject({ error: '#VALUE!', result: null });
        }
    );

    it.each([new Parser(), ClickUpParser.create()])(
        'should return error when used variable is not defined',
        (parser) => {
            expect(parser.parse('ACOTH(foo)')).toMatchObject({ error: '#NAME?', result: null });
        }
    );

    it.each([new Parser(), ClickUpParser.create()])(
        'should evaluate formula expression provided in lower case',
        (parser) => {
            parser.setVariable('foo', [7, 3.5, 3.5, 1, 2]);

            expect(parser.parse('sum(2, 3, Rank.eq(2, foo))')).toMatchObject({ error: null, result: 9 });
        }
    );

    describe('ClickUp Overrides', () => {
        const dateTestCases = [
            ['SUM(DATE(2021,1,1) - 2)', 18626],
            ['SUM(DATE(2021,1,1) - DATE(2021,1,2))', -1],
            ['SUM(DATE(2022,1,1) - DATE(2021,1,1))', 365],
            ['CONCATENATE(DATE(2022,1,1) - DATE(2021,1,1))', '365'],
            [
                "DATE(YEAR(EOMONTH('1/1/11', -3)), MONTH(EOMONTH('1/1/11', -3)), DAY(EOMONTH('1/1/11', -3))) - DATE(2010,10,30)",
                1,
            ],
        ];

        const testCases = [
            ...dateTestCases.map((formula) => [...formula, new Parser()]),
            ...dateTestCases.map((formula) => [...formula, ClickUpParser.create()]),
        ];

        it.each(testCases)(
            'if flags "CONVERT_FORMULAS_IN_NUMBERS" and "CONVERT_DATES_TO_NUMBERS" are off, it should not calculate date subtraction',
            (formula, _, parser) => {
                expect(parser.parse(formula)).toMatchObject({ error: '#VALUE!', result: null });
            }
        );

        it.each(testCases)('should calculate date subtraction', (formula, expectedResult, parser) => {
            parser.setVariable('', true).setVariable('CONVERT_DATES_TO_NUMBERS', true);

            expect(parser.parse(formula)).toMatchObject({ error: null, result: expectedResult });
        });
    });
});
