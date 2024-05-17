import { ClickUpParser } from '../../../../src/clickup/clickupParser';
import Parser from '../../../../src/parser';

describe('.parse() financial formulas', () => {
    it.each([new Parser(), ClickUpParser.create()])('ACCRINT', (parser) => {
        expect(parser.parse('ACCRINT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ACCRINT("2/2/2012")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ACCRINT("2/2/2012", "3/30/2012")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ACCRINT("2/2/2012", "3/30/2012", "12/4/2013")')).toMatchObject({
            error: '#NUM!',
            result: null,
        });
        expect(parser.parse('ACCRINT("2/2/2012", "3/30/2012", "12/4/2013", 0.1)')).toMatchObject({
            error: '#NUM!',
            result: null,
        });
        expect(parser.parse('ACCRINT("2/2/2012", "3/30/2012", "12/4/2013", 0.1, 1000)')).toMatchObject({
            error: '#NUM!',
            result: null,
        });
        expect(parser.parse('ACCRINT("2/2/2012", "3/30/2012", "12/4/2013", 0.1, 1000, 1)')).toMatchObject({
            error: '#NUM!',
            result: null,
        });
        expect(parser.parse('ACCRINT("2/2/2012", "3/30/2012", "12/4/2013", 0.1, 1000, 1, 0)')).toMatchObject({
            error: null,
            result: 183.88888888888889,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('CUMIPMT', (parser) => {
        expect(parser.parse('CUMIPMT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CUMIPMT(0.1/12)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CUMIPMT(0.1/12, 30*12)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CUMIPMT(0.1/12, 30*12, 100000)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('CUMIPMT(0.1/12, 30*12, 100000, 13)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('CUMIPMT(0.1/12, 30*12, 100000, 13, 24)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('CUMIPMT(0.1/12, 30*12, 100000, 13, 24, 0)')).toMatchObject({
            error: null,
            result: -9916.77251395708,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('CUMPRINC', (parser) => {
        expect(parser.parse('CUMPRINC()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CUMPRINC(0.1/12)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CUMPRINC(0.1/12, 30*12)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CUMPRINC(0.1/12, 30*12, 100000)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('CUMPRINC(0.1/12, 30*12, 100000, 13)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('CUMPRINC(0.1/12, 30*12, 100000, 13, 24)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('CUMPRINC(0.1/12, 30*12, 100000, 13, 24, 0)')).toMatchObject({
            error: null,
            result: -614.0863271085129,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('DB', (parser) => {
        expect(parser.parse('DB()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DB(10000)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DB(10000, 1000)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DB(10000, 1000, 6)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DB(10000, 1000, 6, 1)')).toMatchObject({ error: null, result: 3190 });
    });

    it.each([new Parser(), ClickUpParser.create()])('DDB', (parser) => {
        expect(parser.parse('DDB()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DDB(10000)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DDB(10000, 1000)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DDB(10000, 1000, 6)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DDB(10000, 1000, 6, 1)')).toMatchObject({ error: null, result: 3333.333333333333 });
    });

    it.each([new Parser(), ClickUpParser.create()])('DOLLARDE', (parser) => {
        expect(parser.parse('DOLLARDE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DOLLARDE(1.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DOLLARDE(1.1, 4)')).toMatchObject({ error: null, result: 1.25 });
    });

    it.each([new Parser(), ClickUpParser.create()])('DOLLARFR', (parser) => {
        expect(parser.parse('DOLLARFR()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DOLLARFR(1.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DOLLARFR(1.1, 4)')).toMatchObject({ error: null, result: 1.04 });
    });

    it.each([new Parser(), ClickUpParser.create()])('EFFECT', (parser) => {
        expect(parser.parse('EFFECT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('EFFECT(1.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('EFFECT(1.1, 4)')).toBeMatchCloseTo({ error: null, result: 1.6426566406249994 });
    });

    it.each([new Parser(), ClickUpParser.create()])('FV', (parser) => {
        expect(parser.parse('FV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FV(1.1, 10)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FV(1.1, 10, -200)')).toMatchObject({ error: null, result: 303088.74505820015 });
        expect(parser.parse('FV(1.1, 10, -200, -500)')).toMatchObject({ error: null, result: 1137082.7939682505 });
        expect(parser.parse('FV(1.1, 10, -200, -500, 1)')).toMatchObject({ error: null, result: 1470480.4135322706 });
    });

    it.each([new Parser(), ClickUpParser.create()])('FVSCHEDULE', (parser) => {
        parser.on('callRangeValue', (a, b, done) => done([[0.09, 0.1, 0.11]]));

        expect(parser.parse('FVSCHEDULE(100, A1:C1)')).toMatchObject({ error: null, result: 133.08900000000003 });
    });

    it.each([new Parser(), ClickUpParser.create()])('IPMT', (parser) => {
        expect(parser.parse('IPMT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IPMT(0.2, 6)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IPMT(0.2, 6, 24)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IPMT(0.2, 6, 24, 1000)')).toMatchObject({ error: null, result: -196.20794961065468 });
        expect(parser.parse('IPMT(0.2, 6, 24, 1000, 200)')).toMatchObject({ error: null, result: -195.4495395327856 });
        expect(parser.parse('IPMT(0.2, 6, 24, 1000, 200, 1)')).toMatchObject({
            error: null,
            result: -162.87461627732137,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IRR', (parser) => {
        parser.on('callRangeValue', (a, b, done) => done([[-75000, 12000, 15000, 18000, 21000, 24000]]));

        expect(parser.parse('IRR(A1:C1)')).toMatchObject({ error: null, result: 0.05715142887178451 });
    });

    it.each([new Parser(), ClickUpParser.create()])('ISPMT', (parser) => {
        expect(parser.parse('ISPMT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ISPMT(1.1, 2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ISPMT(1.1, 2, 16)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ISPMT(1.1, 2, 16)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ISPMT(1.1, 2, 16, 1000)')).toMatchObject({ error: null, result: -962.5 });
    });

    it.each([new Parser(), ClickUpParser.create()])('MIRR', (parser) => {
        parser.on('callRangeValue', (a, b, done) => done([[-75000, 12000, 15000, 18000, 21000, 24000]]));

        expect(parser.parse('MIRR(A1:C1, 0.1, 0.12)')).toBeMatchCloseTo({ error: null, result: 0.07971710360838036 });
    });

    it.each([new Parser(), ClickUpParser.create()])('NOMINAL', (parser) => {
        expect(parser.parse('NOMINAL()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NOMINAL(1.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NOMINAL(1.1, 2)')).toBeMatchCloseTo({ error: null, result: 0.8982753492378879 });
    });

    it.each([new Parser(), ClickUpParser.create()])('NPER', (parser) => {
        expect(parser.parse('NPER()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NPER(1.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NPER(1.1, -2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NPER(1.1, -2, -100)')).toBeMatchCloseTo({ error: null, result: -5.4254604102768305 });
        expect(parser.parse('NPER(1.1, -2, -100, 1000)')).toBeMatchCloseTo({ error: null, result: 3.081639082679854 });
        expect(parser.parse('NPER(1.1, -2, -100, 1000, 1)')).toBeMatchCloseTo({
            error: null,
            result: 3.058108732153963,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('NPV', (parser) => {
        expect(parser.parse('NPV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NPV(1.1)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('NPV(1.1, -2)')).toBeMatchCloseTo({ error: null, result: -0.9523809523809523 });
        expect(parser.parse('NPV(1.1, -2, -100)')).toBeMatchCloseTo({ error: null, result: -23.6281179138322 });
        expect(parser.parse('NPV(1.1, -2, -100, 1000)')).toBeMatchCloseTo({ error: null, result: 84.3515819026023 });
        expect(parser.parse('NPV(1.1, -2, -100, 1000, 1)')).toBeMatchCloseTo({ error: null, result: 84.4030008072768 });
    });

    it.each([new Parser(), ClickUpParser.create()])('PDURATION', (parser) => {
        expect(parser.parse('PDURATION()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PDURATION(0.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PDURATION(0.1, 200)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PDURATION(0.1, 200, 400)')).toBeMatchCloseTo({ error: null, result: 7.272540897341714 });
    });

    it.each([new Parser(), ClickUpParser.create()])('PMT', (parser) => {
        expect(parser.parse('PMT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PMT(0.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PMT(0.1, 200)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PMT(0.1, 200, 400)')).toBeMatchCloseTo({ error: null, result: -40.00000021063133 });
        expect(parser.parse('PMT(0.1, 200, 400, 500)')).toBeMatchCloseTo({ error: null, result: -40.00000047392049 });
    });

    it.each([new Parser(), ClickUpParser.create()])('PPMT', (parser) => {
        expect(parser.parse('PPMT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PPMT(0.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PPMT(0.1, 200)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PPMT(0.1, 200, 400)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PPMT(0.1, 200, 400, 5000)')).toBeMatchCloseTo({
            error: null,
            result: 0.000012207031261368684,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('PV', (parser) => {
        expect(parser.parse('PV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PV(1.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PV(1.1, 200)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PV(1.1, 200, 400)')).toBeMatchCloseTo({ error: null, result: -363.6363636363636 });
        expect(parser.parse('PV(1.1, 200, 400, 5000)')).toBeMatchCloseTo({ error: null, result: -363.6363636363636 });
        expect(parser.parse('PV(1.1, 200, 400, 5000, 1)')).toBeMatchCloseTo({
            error: null,
            result: -763.6363636363636,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('RATE', (parser) => {
        expect(parser.parse('RATE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('RATE(24)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('RATE(24, -1000)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('RATE(24, -1000, -10000)')).toBeMatchCloseTo({ error: null, result: -1.2079096886965142 });
        expect(parser.parse('RATE(24, -1000, -10000, 10000)')).toMatchObject({ error: null, result: -0.1 });
        expect(parser.parse('RATE(24, -1000, -10000, 10000, 1)')).toBeMatchCloseTo({
            error: null,
            result: -0.09090909090909093,
        });
        expect(parser.parse('RATE(24, -1000, -10000, 10000, 1, 0.1)')).toBeMatchCloseTo({
            error: null,
            result: -0.09090909090909091,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('RRI', (parser) => {
        expect(parser.parse('RRI()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('RRI(8)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('RRI(8, 100)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('RRI(8, 100, 300)')).toBeMatchCloseTo({ error: null, result: 0.1472026904398771 });
    });

    it.each([new Parser(), ClickUpParser.create()])('SLN', (parser) => {
        expect(parser.parse('SLN()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SLN(200)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SLN(200, 750)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SLN(200, 750, 10)')).toMatchObject({ error: null, result: -55 });
    });

    it.each([new Parser(), ClickUpParser.create()])('SYD', (parser) => {
        expect(parser.parse('SYD()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SYD(200)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SYD(200, 750)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SYD(200, 750, 10)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SYD(200, 750, 10, 1)')).toMatchObject({ error: null, result: -100 });
    });

    it.each([new Parser(), ClickUpParser.create()])('TBILLEQ', (parser) => {
        expect(parser.parse('TBILLEQ()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TBILLEQ("03/31/2008")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TBILLEQ("03/31/2008", "06/01/2008")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TBILLEQ("03/31/2008", "06/01/2008", 0.09)')).toBeMatchCloseTo({
            error: null,
            result: 0.09266311246509266,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('TBILLPRICE', (parser) => {
        expect(parser.parse('TBILLPRICE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TBILLPRICE("03/31/2008")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TBILLPRICE("03/31/2008", "06/01/2008")')).toMatchObject({
            error: '#VALUE!',
            result: null,
        });
        expect(parser.parse('TBILLPRICE("03/31/2008", "06/01/2008", 0.09)')).toBeMatchCloseTo({
            error: null,
            result: 98.475,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('TBILLYIELD', (parser) => {
        expect(parser.parse('TBILLYIELD()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TBILLYIELD("03/31/2008")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TBILLYIELD("03/31/2008", "06/01/2008")')).toMatchObject({
            error: '#VALUE!',
            result: null,
        });
        expect(parser.parse('TBILLYIELD("03/31/2008", "06/01/2008", 0.09)')).toBeMatchCloseTo({
            error: null,
            result: 6551.475409836065,
        });
    });

    // TODO: Not supported yet
    it.skip('XIRR', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            let values;

            if (a.label === 'A1' && b.label === 'C1') {
                values = [[-10000, 2750, 4250, 3250, 2750]];
            } else if (a.label === 'A2' && b.label === 'C2') {
                values = [['01/jan/08', '01/mar/08', '30/oct/08', '15/feb/09', '01/apr/09']];
            }

            done(values);
        });

        expect(parser.parse('XIRR(A1:C1, A2:C2, 0.1)')).toBeMatchCloseTo({ error: null, result: 0.373374019797564 });
    });

    it.each([new Parser(), ClickUpParser.create()])('XNPV', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            let values;

            if (a.label === 'A1' && b.label === 'C1') {
                values = [[-10000, 2750, 4250, 3250, 2750]];
            } else if (a.label === 'A2' && b.label === 'C2') {
                values = [['01/01/2008', '03/01/2008', '10/30/2008', '02/15/2009', '04/01/2009']];
            }

            done(values);
        });

        expect(parser.parse('XNPV(0.09, A1:C1, A2:C2)')).toBeMatchCloseTo({ error: null, result: 2086.6718943024616 });
    });
});
