import { ClickUpParser } from '../../../../src/clickup/clickupParser';
import Parser from '../../../../src/parser';

describe('.parse() information formulas', () => {
    it.each([new Parser(), ClickUpParser.create()])('ISBINARY', (parser) => {
        expect(parser.parse('ISBINARY()')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISBINARY(1)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISBINARY(0)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISBINARY("1010")')).toMatchObject({ error: null, result: true });
    });

    it.each([new Parser(), ClickUpParser.create()])('ISBLANK', (parser) => {
        expect(parser.parse('ISBLANK(NULL)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISBLANK(FALSE)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISBLANK(0)')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('ISEVEN', (parser) => {
        expect(parser.parse('ISEVEN(1)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISEVEN(2)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISEVEN(2.5)')).toMatchObject({ error: null, result: true });
    });

    it.each([new Parser(), ClickUpParser.create()])('ISLOGICAL', (parser) => {
        expect(parser.parse('ISLOGICAL(1)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISLOGICAL(TRUE)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISLOGICAL(FALSE)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISLOGICAL(NULL)')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('ISNONTEXT', (parser) => {
        expect(parser.parse('ISNONTEXT()')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISNONTEXT(1)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISNONTEXT(TRUE)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISNONTEXT("FALSE")')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISNONTEXT("foo")')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('ISNUMBER', (parser) => {
        expect(parser.parse('ISNUMBER()')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISNUMBER(1)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISNUMBER(0.142342)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISNUMBER(TRUE)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISNUMBER("FALSE")')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISNUMBER("foo")')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('ISODD', (parser) => {
        expect(parser.parse('ISODD(1)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISODD(2)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISODD(2.5)')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('ISTEXT', (parser) => {
        expect(parser.parse('ISTEXT()')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISTEXT(1)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISTEXT(TRUE)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('ISTEXT("FALSE")')).toMatchObject({ error: null, result: true });
        expect(parser.parse('ISTEXT("foo")')).toMatchObject({ error: null, result: true });
    });
});
