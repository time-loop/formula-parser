import { ClickUpParser } from '../../../../src/clickup/clickupParser';
import Parser from '../../../../src/parser';

describe('.parse() logical formulas', () => {
    it.each([new Parser(), ClickUpParser.create()])('AND', (parser) => {
        expect(parser.parse('AND()')).toMatchObject({ error: null, result: true });
        expect(parser.parse('AND(TRUE, TRUE, FALSE)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('AND(TRUE, TRUE, TRUE)')).toMatchObject({ error: null, result: true });
    });

    it.each([new Parser(), ClickUpParser.create()])('CHOOSE', (parser) => {
        expect(parser.parse('CHOOSE()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('CHOOSE(1, "foo", "bar", "baz")')).toMatchObject({ error: null, result: 'foo' });
        expect(parser.parse('CHOOSE(3, "foo", "bar", "baz")')).toMatchObject({ error: null, result: 'baz' });
        expect(parser.parse('CHOOSE(4, "foo", "bar", "baz")')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('FALSE', (parser) => {
        expect(parser.parse('FALSE()')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('IF', (parser) => {
        expect(parser.parse('IF()')).toMatchObject({ error: null, result: true });
        expect(parser.parse('IF(TRUE, 1, 2)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('IF(FALSE, 1, 2)')).toMatchObject({ error: null, result: 2 });
    });

    it.each([new Parser(), ClickUpParser.create()])('NOT', (parser) => {
        expect(parser.parse('NOT()')).toMatchObject({ error: null, result: true });
        expect(parser.parse('NOT(TRUE)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('NOT(FALSE)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('NOT(0)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('NOT(1)')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('OR', (parser) => {
        expect(parser.parse('OR()')).toMatchObject({ error: null, result: false });
        expect(parser.parse('OR(TRUE, TRUE, TRUE)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('OR(TRUE, FALSE, FALSE)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('OR(FALSE, FALSE, FALSE)')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('TRUE', (parser) => {
        expect(parser.parse('TRUE()')).toMatchObject({ error: null, result: true });
    });

    it.each([new Parser(), ClickUpParser.create()])('XOR', (parser) => {
        expect(parser.parse('XOR()')).toMatchObject({ error: null, result: false });
        expect(parser.parse('XOR(TRUE, TRUE)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('XOR(TRUE, FALSE)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('XOR(FALSE, TRUE)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('XOR(FALSE, FALSE)')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('SWITCH', (parser) => {
        expect(parser.parse('SWITCH()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SWITCH(7, "foo")')).toMatchObject({ error: null, result: 'foo' });
        expect(parser.parse('SWITCH(7, 9, "foo", 7, "bar")')).toMatchObject({ error: null, result: 'bar' });
        expect(parser.parse('SWITCH(10, 9, "foo", 7, "bar")')).toMatchObject({ error: '#N/A', result: null });
    });
});
