import { ClickUpParser } from '../../../../src/clickup/clickupParser';
import Parser from '../../../../src/parser';

describe('.parse() miscellaneous formulas', () => {
    it.each([new Parser(), ClickUpParser.create()])('UNIQUE', (parser) => {
        expect(parser.parse('UNIQUE()')).toMatchObject({ error: null, result: [] });
        expect(parser.parse('UNIQUE(1, 2, 3, 4, 4, 4, 4, 3)')).toMatchObject({ error: null, result: [1, 2, 3, 4] });
        expect(parser.parse('UNIQUE("foo", "bar", "foo")')).toMatchObject({ error: null, result: ['foo', 'bar'] });
    });

    it.each([new Parser(), ClickUpParser.create()])('ARGS2ARRAY', (parser) => {
        expect(parser.parse('ARGS2ARRAY()')).toMatchObject({ error: null, result: [] });
        expect(parser.parse('ARGS2ARRAY(1, 4, 4, 3)')).toMatchObject({ error: null, result: [1, 4, 4, 3] });
        expect(parser.parse('ARGS2ARRAY("foo", "bar", "foo")')).toMatchObject({
            error: null,
            result: ['foo', 'bar', 'foo'],
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('FLATTEN', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'B3') {
                done([[1, 2, [3], [4, 5]]]);
            }
        });

        expect(parser.parse('FLATTEN(A1:B3)')).toMatchObject({ error: null, result: [1, 2, 3, 4, 5] });
    });

    it.each([new Parser(), ClickUpParser.create()])('JOIN', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'B3') {
                done([[1, 2, [3], [4, 5]]]);
            }
        });

        expect(parser.parse('JOIN(A1:B3)')).toMatchObject({ error: null, result: '1,2,3,4,5' });
    });

    it.each([new Parser(), ClickUpParser.create()])('NUMBERS', (parser) => {
        expect(parser.parse('NUMBERS()')).toMatchObject({ error: null, result: [] });
        expect(parser.parse('NUMBERS(1, "4", "4", 3)')).toMatchObject({ error: null, result: [1, 3] });
        expect(parser.parse('NUMBERS("foo", 2, "bar", "foo")')).toMatchObject({ error: null, result: [2] });
    });

    it.each([new Parser(), ClickUpParser.create()])('REFERENCE', (parser) => {
        parser.on('callCellValue', (a, done) => {
            if (a.label === 'A1') {
                done({ name: { firstName: 'Jim' } });
            }
        });

        expect(parser.parse('REFERENCE(A1, "name.firstName")')).toMatchObject({ error: null, result: 'Jim' });
    });
});
