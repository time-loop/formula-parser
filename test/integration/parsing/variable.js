import { ClickUpParser } from '../../../src/clickup/clickupParser';
import Parser from '../../../src/parser';

describe('.parse() variable', () => {
    it.each([new Parser(), ClickUpParser.create()])('should evaluate defaults variables', (parser) => {
        expect(parser.parse('TRUE')).toMatchObject({ error: null, result: true });
        expect(parser.parse('FALSE')).toMatchObject({ error: null, result: false });
        expect(parser.parse('NULL')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should evaluate custom variables', (parser) => {
        expect(parser.parse('foo')).toMatchObject({ error: '#NAME?', result: null });

        parser.setVariable('foo', 'bar');
        parser.setVariable('baz', '6.6');

        expect(parser.parse('foo')).toMatchObject({ error: null, result: 'bar' });
        expect(parser.parse('SUM(baz, 2.1, 0.2)')).toMatchObject({ error: null, result: 8.899999999999999 });
    });
});
