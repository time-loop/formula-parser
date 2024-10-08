import { ClickUpParser } from '../../../../src/clickup/clickupParser';
import Parser from '../../../../src/parser';

describe('.parse() text formulas', () => {
    it.each([new Parser(), ClickUpParser.create()])('CHAR', (parser) => {
        expect(parser.parse('CHAR()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CHAR(33)')).toMatchObject({ error: null, result: '!' });
    });

    it.each([new Parser(), ClickUpParser.create()])('CLEAN', (parser) => {
        expect(parser.parse('CLEAN()')).toMatchObject({ error: null, result: '' });
        expect(parser.parse('CLEAN(CHAR(9)&"Monthly report"&CHAR(10))')).toMatchObject({
            error: null,
            result: 'Monthly report',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('CODE', (parser) => {
        expect(parser.parse('CODE()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('CODE("a")')).toMatchObject({ error: null, result: 97 });
    });

    it.each([new Parser(), ClickUpParser.create()])('CONCATENATE', (parser) => {
        expect(parser.parse('CONCATENATE()')).toMatchObject({ error: null, result: '' });
        expect(parser.parse('CONCATENATE("a")')).toMatchObject({ error: null, result: 'a' });
        expect(parser.parse('CONCATENATE("a", 1)')).toMatchObject({ error: null, result: 'a1' });
        expect(parser.parse('CONCATENATE("a", 1, TRUE)')).toMatchObject({ error: null, result: 'a1TRUE' });
    });

    it.skip.each([new Parser(), ClickUpParser.create()])('DOLLAR', (parser) => {
        expect(parser.parse('DOLLAR()')).toMatchObject({ error: '#NAME?', result: null });
        expect(parser.parse('DOLLAR(1100)')).toMatchObject({ error: null, result: '$1,100.00' });
        expect(parser.parse('DOLLAR(1100, -2)')).toMatchObject({ error: null, result: '$1,100' });
    });

    it.each([new Parser(), ClickUpParser.create()])('EXACT', (parser) => {
        expect(parser.parse('EXACT()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('EXACT(1100)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('EXACT(1100, -2)')).toMatchObject({ error: null, result: false });
        expect(parser.parse('EXACT(1100, 1100)')).toMatchObject({ error: null, result: true });
        expect(parser.parse('EXACT(1100, "1100")')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('FIND', (parser) => {
        expect(parser.parse('FIND()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('FIND("o")')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('FIND("o", "FooBar")')).toMatchObject({ error: null, result: 2 });
        expect(parser.parse('FIND("O", "FooBar")')).toMatchObject({ error: null, result: 0 });
    });

    it.skip.each([new Parser(), ClickUpParser.create()])('FIXED', (parser) => {
        expect(parser.parse('FIXED()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FIXED(12345.11, -1)')).toMatchObject({ error: null, result: '12,350' });
        expect(parser.parse('FIXED(12345.11, 0)')).toMatchObject({ error: null, result: '12,345' });
        expect(parser.parse('FIXED(12345.11, 0, TRUE)')).toMatchObject({ error: null, result: '12345' });
        expect(parser.parse('FIXED(12345.11, 4, TRUE)')).toMatchObject({ error: null, result: '12345.1100' });
    });

    it.each([new Parser(), ClickUpParser.create()])('HTML2TEXT', (parser) => {
        expect(parser.parse('HTML2TEXT()')).toMatchObject({ error: null, result: '' });
        expect(parser.parse('HTML2TEXT("Click <a>Link</a>")')).toMatchObject({ error: null, result: 'Click Link' });
    });

    it.each([new Parser(), ClickUpParser.create()])('LEFT', (parser) => {
        expect(parser.parse('LEFT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LEFT("Foo Bar")')).toMatchObject({ error: null, result: 'F' });
        expect(parser.parse('LEFT("Foo Bar", 3)')).toMatchObject({ error: null, result: 'Foo' });
    });

    it.each([new Parser(), ClickUpParser.create()])('LEN', (parser) => {
        expect(parser.parse('LEN()')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('LEN(TRUE)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LEN(1023)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LEN("Foo Bar")')).toMatchObject({ error: null, result: 7 });
    });

    it.each([new Parser(), ClickUpParser.create()])('LOWER', (parser) => {
        expect(parser.parse('LOWER()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LOWER("")')).toMatchObject({ error: null, result: '' });
        expect(parser.parse('LOWER("Foo Bar")')).toMatchObject({ error: null, result: 'foo bar' });
    });

    it.each([new Parser(), ClickUpParser.create()])('MID', (parser) => {
        expect(parser.parse('MID()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('MID("")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('MID("Foo Bar", 2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('MID("Foo Bar", 2, 5)')).toMatchObject({ error: null, result: 'oo Ba' });
    });

    it.each([new Parser(), ClickUpParser.create()])('PROPER', (parser) => {
        expect(parser.parse('PROPER()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PROPER("")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PROPER(TRUE)')).toMatchObject({ error: null, result: 'True' });
        expect(parser.parse('PROPER(1234)')).toMatchObject({ error: null, result: '1234' });
        expect(parser.parse('PROPER("foo bar")')).toMatchObject({ error: null, result: 'Foo Bar' });
    });

    it.each([new Parser(), ClickUpParser.create()])('REGEXEXTRACT', (parser) => {
        expect(parser.parse('REGEXEXTRACT()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('REGEXEXTRACT("extract foo bar", "(foo)")')).toMatchObject({ error: null, result: 'foo' });
        expect(parser.parse('REGEXEXTRACT("pressure 12.21bar", "([0-9]+.[0-9]+)")')).toMatchObject({
            error: null,
            result: '12.21',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('REGEXREPLACE', (parser) => {
        expect(parser.parse('REGEXREPLACE()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('REGEXREPLACE("extract foo bar", "(foo)", "baz")')).toMatchObject({
            error: null,
            result: 'extract baz bar',
        });
        expect(parser.parse('REGEXREPLACE("pressure 12.21bar", "([0-9]+.[0-9]+)", "43.1")')).toMatchObject({
            error: null,
            result: 'pressure 43.1bar',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('REGEXMATCH', (parser) => {
        expect(parser.parse('REGEXMATCH()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('REGEXMATCH("pressure 12.21bar", "([0-9]+.[0-9]+)")')).toMatchObject({
            error: null,
            result: true,
        });

        const result = parser.parse('REGEXMATCH("pressure 12.33bar", "([0-9]+.[0-9]+)", TRUE)');

        expect(result).toBeInstanceOf(Object);
    });

    it.each([new Parser(), ClickUpParser.create()])('REPLACE', (parser) => {
        expect(parser.parse('REPLACE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('REPLACE("foo bar")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('REPLACE("foo bar", 2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('REPLACE("foo bar", 2, 5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('REPLACE("foo bar", 2, 5, "*")')).toMatchObject({ error: null, result: 'f*r' });
    });

    it.each([new Parser(), ClickUpParser.create()])('REPT', (parser) => {
        expect(parser.parse('REPT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('REPT("foo ")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('REPT("foo ", 5)')).toMatchObject({ error: null, result: 'foo foo foo foo foo ' });
    });

    it.each([new Parser(), ClickUpParser.create()])('RIGHT', (parser) => {
        expect(parser.parse('RIGHT()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('RIGHT("foo bar")')).toMatchObject({ error: null, result: 'r' });
        expect(parser.parse('RIGHT("foo bar", 4)')).toMatchObject({ error: null, result: ' bar' });
    });

    it.each([new Parser(), ClickUpParser.create()])('SEARCH', (parser) => {
        expect(parser.parse('SEARCH()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SEARCH("bar")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SEARCH("bar", "foo bar")')).toMatchObject({ error: null, result: 5 });
    });

    it.each([new Parser(), ClickUpParser.create()])('SPLIT', (parser) => {
        expect(parser.parse('SPLIT()')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('SPLIT("foo bar baz")')).toMatchObject({ error: null, result: ['foo bar baz'] });
        expect(parser.parse('SPLIT("foo bar baz", " ")')).toMatchObject({ error: null, result: ['foo', 'bar', 'baz'] });
    });

    it.each([new Parser(), ClickUpParser.create()])('SUBSTITUTE', (parser) => {
        expect(parser.parse('SUBSTITUTE()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('SUBSTITUTE("foo bar baz")')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('SUBSTITUTE("foo bar baz", "a", "A")')).toMatchObject({
            error: null,
            result: 'foo bAr bAz',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('T', (parser) => {
        expect(parser.parse('T()')).toMatchObject({ error: null, result: '' });
        expect(parser.parse('T(TRUE)')).toMatchObject({ error: null, result: '' });
        expect(parser.parse('T(9.887)')).toMatchObject({ error: null, result: '' });
        expect(parser.parse('T("foo bar baz")')).toMatchObject({ error: null, result: 'foo bar baz' });
    });

    it.skip.each([new Parser(), ClickUpParser.create()])('TEXT', (parser) => {
        expect(parser.parse('TEXT()')).toMatchObject({ error: '#NAME?', result: null });
        expect(parser.parse('TEXT(1234.99)')).toMatchObject({ error: null, result: '1,235' });
        expect(parser.parse('TEXT(1234.99, "####.#")')).toMatchObject({ error: null, result: '1235.0' });
        expect(parser.parse('TEXT(1234.99, "####.###")')).toMatchObject({ error: null, result: '1234.990' });
    });

    it.each([new Parser(), ClickUpParser.create()])('TRIM', (parser) => {
        expect(parser.parse('TRIM()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TRIM("")')).toMatchObject({ error: null, result: '' });
        expect(parser.parse('TRIM("     ")')).toMatchObject({ error: null, result: '' });
        expect(parser.parse('TRIM("   foo  ")')).toMatchObject({ error: null, result: 'foo' });
    });

    it.each([new Parser(), ClickUpParser.create()])('UNICHAR', (parser) => {
        expect(parser.parse('UNICHAR()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('UNICHAR(33)')).toMatchObject({ error: null, result: '!' });
    });

    it.each([new Parser(), ClickUpParser.create()])('UNICODE', (parser) => {
        expect(parser.parse('UNICODE()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('UNICODE("!")')).toMatchObject({ error: null, result: 33 });
    });

    it.each([new Parser(), ClickUpParser.create()])('UPPER', (parser) => {
        expect(parser.parse('UPPER()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('UPPER("foo Bar")')).toMatchObject({ error: null, result: 'FOO BAR' });
    });

    it.skip.each([new Parser(), ClickUpParser.create()])('VALUE', (parser) => {
        expect(parser.parse('VALUE()')).toMatchObject({ error: '#NAME?', result: null });
        expect(parser.parse('VALUE("$1,000")')).toMatchObject({ error: null, result: 1000 });
        expect(parser.parse('VALUE("01:00:00")')).toMatchObject({ error: null, result: 3600 });
        expect(parser.parse('VALUE("foo Bar")')).toMatchObject({ error: null, result: 0 });
    });
});
