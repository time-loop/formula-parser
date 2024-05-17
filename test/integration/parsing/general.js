import { ClickUpParser } from '../../../src/clickup/clickupParser';
import Parser from '../../../src/parser';

describe('.parse() general', () => {
    it.each([new Parser(), ClickUpParser.create()])('should parse an empty string as it is', (parser) => {
        expect(parser.parse('')).toMatchObject({ error: null, result: '' });
    });

    it.each([new Parser(), ClickUpParser.create()])('should not parse an number type data', (parser) => {
        expect(parser.parse(200)).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse(20.1)).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should not parse null type data', (parser) => {
        expect(parser.parse(null)).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should not parse undefined type data', (parser) => {
        expect(parser.parse(void 0)).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should not parse object type data', (parser) => {
        expect(parser.parse({})).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse({ a: 1 })).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should not parse array type data', (parser) => {
        expect(parser.parse([])).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse([1, 2])).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse(() => {})).toMatchObject({ error: '#ERROR!', result: null });
    });
});
