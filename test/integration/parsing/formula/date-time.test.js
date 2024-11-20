import { ClickUpParser } from '../../../../src/clickup/clickupParser';
import Parser from '../../../../src/parser';

describe('.parse() date & time formulas', () => {
    it.each([new Parser(), ClickUpParser.create()])('DATE', (parser) => {
        expect(parser.parse('DATE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DATE(null, 5, 12)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('DATE(2001, null, 12)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('DATE(2001, 5, null)')).toMatchObject({ error: null, result: null });

        const { error, result } = parser.parse('DATE(2001, 5, 12)');

        expect(error).toBeNull();
        expect(result.getFullYear()).toBe(2001);
        expect(result.getMonth()).toBe(4); // counting from zero
        expect(result.getDate()).toBe(12);
    });

    it.each([new Parser(), ClickUpParser.create()])('DATEVALUE', (parser) => {
        expect(parser.parse('DATEVALUE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DATEVALUE(null)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('DATEVALUE("1/1/1900")')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('DATEVALUE("1/1/2000")')).toMatchObject({ error: null, result: 36526 });
    });

    it.each([new Parser(), ClickUpParser.create()])('DAY', (parser) => {
        expect(parser.parse('DAY()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DAY(1)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('DAY(2958465)')).toMatchObject({ error: null, result: 31 });
        expect(parser.parse('DAY("2958465")')).toMatchObject({ error: null, result: 31 });
        expect(parser.parse('DAY(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('DAYS', (parser) => {
        expect(parser.parse('DAYS()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DAYS(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DAYS(1, 6)')).toMatchObject({ error: null, result: -5 });
        expect(parser.parse('DAYS("1/2/2000", "1/10/2001")')).toMatchObject({ error: null, result: -374 });
        expect(parser.parse('DAYS(null, 1)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('DAYS(1, null)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('DAYS(null, null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('DAYS360', (parser) => {
        expect(parser.parse('DAYS360()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DAYS360(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DAYS360(1, 6)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DAYS360("1/1/1901", "2/1/1901", TRUE)')).toMatchObject({ error: null, result: 30 });
        expect(parser.parse('DAYS360("1/1/1901", "12/31/1901", FALSE)')).toMatchObject({ error: null, result: 360 });
        expect(parser.parse('DAYS360(null, "1/1/1901")')).toMatchObject({ error: null, result: null });
        expect(parser.parse('DAYS360("1/1/1901", null)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('DAYS360(null, null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('EDATE', (parser) => {
        expect(parser.parse('EDATE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('EDATE(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('EDATE("1/1/1900", 1)')).toMatchObject({ error: null, result: 32 });
        expect(parser.parse('EDATE(null, 1)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('EDATE("1/1/1900", null)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('EDATE(null, null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('EOMONTH', (parser) => {
        expect(parser.parse('EOMONTH()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('EOMONTH(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('EOMONTH("1/1/1900", 1)')).toMatchObject({ error: null, result: 59 });
        expect(parser.parse('EOMONTH(null, 1)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('EOMONTH("1/1/1900", null)')).toMatchObject({ error: null, result: 31 });
        expect(parser.parse('EOMONTH(null, null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('HOUR', (parser) => {
        expect(parser.parse('HOUR()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('HOUR("1/1/1900 16:33")')).toMatchObject({ error: null, result: 16 });
        expect(parser.parse('HOUR(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('INTERVAL', (parser) => {
        expect(parser.parse('INTERVAL()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('INTERVAL(0)')).toMatchObject({ error: null, result: 'PT' });
        expect(parser.parse('INTERVAL(1)')).toMatchObject({ error: null, result: 'PT1S' });
        expect(parser.parse('INTERVAL(60)')).toMatchObject({ error: null, result: 'PT1M' });
        expect(parser.parse('INTERVAL(10000000)')).toMatchObject({ error: null, result: 'P3M25DT17H46M40S' });
        expect(parser.parse('INTERVAL(null)')).toMatchObject({ error: null, result: 'PT' });
    });

    it.each([new Parser(), ClickUpParser.create()])('ISOWEEKNUM', (parser) => {
        expect(parser.parse('ISOWEEKNUM()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ISOWEEKNUM("1/8/1901")')).toMatchObject({ error: null, result: 2 });
        expect(parser.parse('ISOWEEKNUM("6/6/1902")')).toMatchObject({ error: null, result: 23 });
        expect(parser.parse('ISOWEEKNUM(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('MINUTE', (parser) => {
        expect(parser.parse('MINUTE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('MINUTE("1/1/1901 1:01")')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('MINUTE("1/1/1901 15:36")')).toMatchObject({ error: null, result: 36 });
        expect(parser.parse('MINUTE(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('MONTH', (parser) => {
        expect(parser.parse('MONTH()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('MONTH("2/1/1901")')).toMatchObject({ error: null, result: 2 });
        expect(parser.parse('MONTH("10/1/1901")')).toMatchObject({ error: null, result: 10 });
        expect(parser.parse('MONTH(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('NETWORKDAYS', (parser) => {
        expect(parser.parse('NETWORKDAYS()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NETWORKDAYS("2/1/1901")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NETWORKDAYS("2013-12-04", "2013-12-05")')).toMatchObject({ error: null, result: 2 });
        expect(parser.parse('NETWORKDAYS("2013-11-04", "2013-12-05")')).toMatchObject({ error: null, result: 24 });
        expect(parser.parse('NETWORKDAYS("10/1/2012", "3/1/2013", [\'11/22/2012\'])')).toMatchObject({
            error: null,
            result: 109,
        });
        expect(parser.parse('NETWORKDAYS(null, "2013-12-05")')).toMatchObject({ error: null, result: null });
        expect(parser.parse('NETWORKDAYS("2013-12-05", null)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('NETWORKDAYS(null, null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('NOW', (parser) => {
        const { error, result } = parser.parse('NOW()');
        const now = new Date();

        expect(error).toBeNull();
        expect(result.toString()).toBe(now.toString());
    });

    it.each([new Parser(), ClickUpParser.create()])('SECOND', (parser) => {
        expect(parser.parse('SECOND()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SECOND("2/1/1901 13:33:12")')).toMatchObject({ error: null, result: 12 });
        expect(parser.parse('SECOND(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('TIME', (parser) => {
        expect(parser.parse('TIME()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TIME(0)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TIME(0, 0)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TIME(0, 0, 0)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('TIME(1, 1, 1)')).toMatchObject({ error: null, result: 0.04237268518518519 });
        expect(parser.parse('TIME(24, 0, 0)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('TIME(null, 0, 0)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('TIME(0, null, 0)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('TIME(0, 0, null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('TIMEVALUE', (parser) => {
        expect(parser.parse('TIMEVALUE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TIMEVALUE("1/1/1900 00:00:00")')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('TIMEVALUE("1/1/1900 23:00:00")')).toMatchObject({
            error: null,
            result: 0.9583333333333334,
        });
        expect(parser.parse('TIMEVALUE(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('TODAY', (parser) => {
        const { error, result } = parser.parse('TODAY()');
        const now = new Date();

        expect(error).toBeNull();
        expect(result.getDate()).toBe(now.getDate());
    });

    it.each([new Parser(), ClickUpParser.create()])('WEEKDAY', (parser) => {
        expect(parser.parse('WEEKDAY()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('WEEKDAY("1/1/1901")')).toMatchObject({ error: null, result: 3 });
        expect(parser.parse('WEEKDAY("1/1/1901", 2)')).toMatchObject({ error: null, result: 2 });
        expect(parser.parse('WEEKDAY(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('WEEKNUM', (parser) => {
        expect(parser.parse('WEEKNUM()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('WEEKNUM("2/1/1900")')).toMatchObject({ error: null, result: 5 });
        expect(parser.parse('WEEKNUM("2/1/1909", 2)')).toMatchObject({ error: null, result: 6 });
        expect(parser.parse('WEEKNUM(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('WORKDAY', (parser) => {
        expect(parser.parse('WORKDAY()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('WORKDAY("1/1/1900")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('WORKDAY(null)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('WORKDAY("1/1/1900", null)')).toMatchObject({ error: null, result: new Date(1900, 0, 1) });

        const { result, error } = parser.parse('WORKDAY("1/1/1900", 1)');

        expect(error).toBeNull();
        expect(result.getDate()).toBe(2);
    });

    it.each([new Parser(), ClickUpParser.create()])('YEAR', (parser) => {
        expect(parser.parse('YEAR()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('YEAR("1/1/1904")')).toMatchObject({ error: null, result: 1904 });
        expect(parser.parse('YEAR("12/12/2001")')).toMatchObject({ error: null, result: 2001 });
        expect(parser.parse('YEAR(null)')).toMatchObject({ error: null, result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('YEARFRAC', (parser) => {
        expect(parser.parse('YEARFRAC()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('YEARFRAC("1/1/1904")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('YEARFRAC("1/1/1900", "1/2/1900")')).toMatchObject({
            error: null,
            result: 0.002777777777777778,
        });
        expect(parser.parse('YEARFRAC(null, "1/2/1900")')).toMatchObject({ error: null, result: null });
        expect(parser.parse('YEARFRAC("1/1/1900", null)')).toMatchObject({ error: null, result: null });
        expect(parser.parse('YEARFRAC(null, null)')).toMatchObject({ error: null, result: null });
    });
});
