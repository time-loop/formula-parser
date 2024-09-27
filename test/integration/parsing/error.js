import { ClickUpParser } from '../../../src/clickup/clickupParser';
import Parser from '../../../src/parser';

describe('.parse() error', () => {
    it.each([new Parser(), ClickUpParser.create()])('should parse general error', (parser) => {
        expect(parser.parse('#ERROR!')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#ERRfefweOR!')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse(' #ERRfefweOR! ')).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should parse DIV/0 error', (parser) => {
        expect(parser.parse('#DIV/0!')).toMatchObject({ error: '#DIV/0!', result: null });
        expect(parser.parse('#DIV/0?')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#DIV/1!')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#DIV/')).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should parse NAME error', (parser) => {
        expect(parser.parse('#NAME?')).toMatchObject({ error: '#NAME?', result: null });
        expect(parser.parse('#NAME!')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#NAMe!')).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should parse N/A error', (parser) => {
        expect(parser.parse('#N/A')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('#N/A!')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#N/A?')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#NA')).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should parse NULL error', (parser) => {
        expect(parser.parse('#NULL!')).toMatchObject({ error: '#NULL!', result: null });
        expect(parser.parse('#NULL?')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#NULl!')).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should parse NUM error', (parser) => {
        expect(parser.parse('#NUM!')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('#NUM?')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#NuM!')).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should parse REF error', (parser) => {
        expect(parser.parse('#REF!')).toMatchObject({ error: '#REF!', result: null });
        expect(parser.parse('#REF?')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#REf!')).toMatchObject({ error: '#ERROR!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('should parse VALUE error', (parser) => {
        expect(parser.parse('#VALUE!')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('#VALUE?')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('#VALUe!')).toMatchObject({ error: '#ERROR!', result: null });
    });
});
