import { ClickUpParser } from '../../../src/clickup/clickupParser';
import Parser from '../../../src/parser';

describe('.parse() logical', () => {
    it.each([new Parser(), ClickUpParser.create()])('operator: =', (parser) => {
        expect(parser.parse('10 = 10')).toMatchObject({ error: null, result: true });

        expect(parser.parse('10 = 11')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('operator: >', (parser) => {
        expect(parser.parse('11 > 10')).toMatchObject({ error: null, result: true });
        expect(parser.parse('10 > 1.1')).toMatchObject({ error: null, result: true });
        expect(parser.parse('10 >- 10')).toMatchObject({ error: null, result: true });

        expect(parser.parse('10 > 11')).toMatchObject({ error: null, result: false });
        expect(parser.parse('10 > 11.1')).toMatchObject({ error: null, result: false });
        expect(parser.parse('10 > 10.00001')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('operator: <', (parser) => {
        expect(parser.parse('10 < 11')).toMatchObject({ error: null, result: true });
        expect(parser.parse('10 < 11.1')).toMatchObject({ error: null, result: true });
        expect(parser.parse('10 < 10.00001')).toMatchObject({ error: null, result: true });

        expect(parser.parse('11 < 10')).toMatchObject({ error: null, result: false });
        expect(parser.parse('10 < 1.1')).toMatchObject({ error: null, result: false });
        expect(parser.parse('10 <- 10')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('operator: >=', (parser) => {
        expect(parser.parse('11 >= 10')).toMatchObject({ error: null, result: true });
        expect(parser.parse('11 >= 11')).toMatchObject({ error: null, result: true });
        expect(parser.parse('10 >= 10')).toMatchObject({ error: null, result: true });
        expect(parser.parse('10 >= -10')).toMatchObject({ error: null, result: true });

        expect(parser.parse('10 >= 11')).toMatchObject({ error: null, result: false });
        expect(parser.parse('10 >= 11.1')).toMatchObject({ error: null, result: false });
        expect(parser.parse('10 >= 10.00001')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('operator: <=', (parser) => {
        expect(parser.parse('10 <= 10')).toMatchObject({ error: null, result: true });
        expect(parser.parse('1.1 <= 10')).toMatchObject({ error: null, result: true });
        expect(parser.parse('-10 <= 10')).toMatchObject({ error: null, result: true });

        expect(parser.parse('11 <= 10')).toMatchObject({ error: null, result: false });
        expect(parser.parse('11.1 <= 10')).toMatchObject({ error: null, result: false });
        expect(parser.parse('10.00001 <= 10')).toMatchObject({ error: null, result: false });
    });

    it.each([new Parser(), ClickUpParser.create()])('operator: <>', (parser) => {
        expect(parser.parse('10 <> 11')).toMatchObject({ error: null, result: true });
        expect(parser.parse('1.1 <> 10')).toMatchObject({ error: null, result: true });
        expect(parser.parse('-10 <> 10')).toMatchObject({ error: null, result: true });

        expect(parser.parse('10 <> 10')).toMatchObject({ error: null, result: false });
        expect(parser.parse('11.1 <> 11.1')).toMatchObject({ error: null, result: false });
        expect(parser.parse('10.00001 <> 10.00001')).toMatchObject({ error: null, result: false });
    });
});
