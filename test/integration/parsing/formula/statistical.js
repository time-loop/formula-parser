import { ClickUpParser } from '../../../../src/clickup/clickupParser';
import Parser from '../../../../src/parser';

describe('.parse() statistical formulas', () => {
    it.each([new Parser(), ClickUpParser.create()])('AVEDEV', (parser) => {
        expect(parser.parse('AVEDEV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('AVEDEV(1.1)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('AVEDEV(1.1, 2)')).toBeMatchCloseTo({ error: null, result: 0.45 });
        expect(parser.parse('AVEDEV(1.1, 2, 5)')).toBeMatchCloseTo({ error: null, result: 1.5333333333333332 });
        expect(parser.parse('AVEDEV(1.1, 2, 5, 10)')).toBeMatchCloseTo({ error: null, result: 2.975 });
    });

    it.each([new Parser(), ClickUpParser.create()])('AVERAGE', (parser) => {
        expect(parser.parse('AVERAGE()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('AVERAGE(1.1)')).toBeMatchCloseTo({ error: null, result: 1.1 });
        expect(parser.parse('AVERAGE(1.1, 2, 5, 10)')).toBeMatchCloseTo({ error: null, result: 4.525 });
        expect(parser.parse('AVERAGE(1.1, TRUE, 2, NULL, 5, 10)')).toBeMatchCloseTo({ error: null, result: 4.525 });
    });

    it.each([new Parser(), ClickUpParser.create()])('AVERAGEA', (parser) => {
        expect(parser.parse('AVERAGEA()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('AVERAGEA(1.1)')).toBeMatchCloseTo({ error: null, result: 1.1 });
        expect(parser.parse('AVERAGEA(1.1, 2, 5, 10)')).toBeMatchCloseTo({ error: null, result: 4.525 });
        expect(parser.parse('AVERAGEA(1.1, TRUE, 2, NULL, 5, 10)')).toBeMatchCloseTo({ error: null, result: 3.82 });
    });

    it.each([new Parser(), ClickUpParser.create()])('AVERAGEIF', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'B3') {
                done([
                    [2, 4],
                    [8, 16],
                ]);
            } else if (a.label === 'A4' && b.label === 'B6') {
                done([
                    [1, 2],
                    [3, 4],
                ]);
            }
        });

        expect(parser.parse('AVERAGEIF(A1:B3, ">5", A4:B6)')).toMatchObject({ error: null, result: 3.5 });
    });

    it.each([new Parser(), ClickUpParser.create()])('AVERAGEIFS', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'D1') {
                done([2, 4, 8, 16]);
            } else if (a.label === 'A2' && b.label === 'D2') {
                done([1, 2, 3, 4]);
            } else if (a.label === 'A3' && b.label === 'D3') {
                done([1, 2, 3, 4]);
            }
        });

        expect(parser.parse('AVERAGEIFS(A1:D1, A2:D2, ">2", A3:D3, ">2")')).toMatchObject({ error: null, result: 12 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BETADIST', (parser) => {
        expect(parser.parse('BETADIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BETADIST(2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BETADIST(2, 8)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BETADIST(2, 8, 10)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BETADIST(2, 8, 10, TRUE, 1)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('BETADIST(2, 8, 10, TRUE, 1, 3)')).toBeMatchCloseTo({
            error: null,
            result: 0.6854705810117458,
        });
        expect(parser.parse('BETA.DIST(2, 8, 10, TRUE, 1, 3)')).toBeMatchCloseTo({
            error: null,
            result: 0.6854705810117458,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('BETAINV', (parser) => {
        expect(parser.parse('BETAINV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BETAINV(0.6854705810117458, 8, 10, 1, 3)')).toBeMatchCloseTo({ error: null, result: 2 });
        expect(parser.parse('BETA.INV(0.6854705810117458, 8, 10, 1, 3)')).toBeMatchCloseTo({ error: null, result: 2 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BINOMDIST', (parser) => {
        expect(parser.parse('BINOMDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOMDIST(6)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOMDIST(6, 10)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOMDIST(6, 10, 0.5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOMDIST(6, 10, 0.5, FALSE)')).toBeMatchCloseTo({ error: null, result: 0.205078125 });
        expect(parser.parse('BINOM.DIST(6, 10, 0.5, FALSE)')).toBeMatchCloseTo({ error: null, result: 0.205078125 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BINOM.DIST.RANGE', (parser) => {
        expect(parser.parse('BINOM.DIST.RANGE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOM.DIST.RANGE(60)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOM.DIST.RANGE(60, 0.5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOM.DIST.RANGE(60, 0.5, 34)')).toBeMatchCloseTo({
            error: null,
            result: 0.060616586840172675,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('BINOM.INV', (parser) => {
        expect(parser.parse('BINOM.INV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOM.INV(6)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOM.INV(6, 0.5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BINOM.INV(6, 0.5, 0.7)')).toMatchObject({ error: null, result: 4 });
    });

    it.each([new Parser(), ClickUpParser.create()])('CHISQ.DIST', (parser) => {
        expect(parser.parse('CHISQ.DIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CHISQ.DIST(0.5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CHISQ.DIST(0.5, 1)')).toBeMatchCloseTo({ error: null, result: 0.43939128946770356 });
        expect(parser.parse('CHISQ.DIST(0.5, 1, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.5204998778130242 });
    });

    it.each([new Parser(), ClickUpParser.create()])('CHISQ.DIST.RT', (parser) => {
        expect(parser.parse('CHISQ.DIST.RT()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('CHISQ.DIST.RT(0.5)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('CHISQ.DIST.RT(0.5, 1)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('CHISQ.DIST.RT(3, 5)')).toBeMatchCloseTo({ error: null, result: 0.6999858358786271 });
    });

    it.each([new Parser(), ClickUpParser.create()])('CHISQ.INV', (parser) => {
        expect(parser.parse('CHISQ.INV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CHISQ.INV(0.5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CHISQ.INV(0.5, 6)')).toBeMatchCloseTo({ error: null, result: 5.348120627447116 });
    });

    it.each([new Parser(), ClickUpParser.create()])('CHISQ.INV.RT', (parser) => {
        expect(parser.parse('CHISQ.INV.RT()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('CHISQ.INV.RT(0.5)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('CHISQ.INV.RT(-1, 2)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('CHISQ.INV.RT(0.4, 6)')).toBeMatchCloseTo({ error: null, result: 6.2107571945266935 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COLUMN', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'C2') {
                done([
                    [1, 2],
                    [2, 3],
                    [2, 4],
                ]);
            }
        });

        expect(parser.parse('COLUMN()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('COLUMN(A1:C2)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('COLUMN(A1:C2, 0)')).toMatchObject({ error: null, result: [[1], [2], [2]] });
        expect(parser.parse('COLUMN(A1:C2, 1)')).toMatchObject({ error: null, result: [[2], [3], [4]] });
    });

    it.each([new Parser(), ClickUpParser.create()])('COLUMNS', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'C2') {
                done([
                    [1, 2],
                    [2, 3],
                    [2, 4],
                ]);
            }
        });

        expect(parser.parse('COLUMNS()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('COLUMNS(A1:C2)')).toMatchObject({ error: null, result: 2 });
    });

    it.each([new Parser(), ClickUpParser.create()])('CONFIDENCE', (parser) => {
        expect(parser.parse('CONFIDENCE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CONFIDENCE(0.5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CONFIDENCE(0.5, 1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CONFIDENCE(0.5, 1, 5)')).toBeMatchCloseTo({ error: null, result: 0.301640986313058 });
        expect(parser.parse('CONFIDENCE.NORM(0.5, 1, 5)')).toBeMatchCloseTo({ error: null, result: 0.301640986313058 });
    });

    it.each([new Parser(), ClickUpParser.create()])('CONFIDENCE.T', (parser) => {
        expect(parser.parse('CONFIDENCE.T()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CONFIDENCE.T(0.5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CONFIDENCE.T(0.5, 1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CONFIDENCE.T(0.5, 1, 5)')).toBeMatchCloseTo({ error: null, result: 0.33124980616238564 });
    });

    it.each([new Parser(), ClickUpParser.create()])('CORREL', (parser) => {
        parser.setVariable('foo', [3, 2, 4, 5, 6]);
        parser.setVariable('bar', [9, 7, 12, 15, 17]);

        expect(parser.parse('CORREL()')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('CORREL(foo, bar)')).toBeMatchCloseTo({ error: null, result: 0.9970544855015815 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COUNT', (parser) => {
        expect(parser.parse('COUNT()')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('COUNT(0.5)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('COUNT(TRUE, 0.5, "foo", 1, 8)')).toMatchObject({ error: null, result: 3 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COUNTA', (parser) => {
        expect(parser.parse('COUNTA()')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('COUNTA(0.5)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('COUNTA(TRUE, 0.5, "foo", 1, 8)')).toMatchObject({ error: null, result: 5 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COUNTBLANK', (parser) => {
        expect(parser.parse('COUNTBLANK()')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('COUNTBLANK(0.5)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('COUNTBLANK(TRUE, 0.5, "", 1, 8)')).toMatchObject({ error: null, result: 1 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COUNTIF', (parser) => {
        parser.setVariable('foo', [1, null, 3, 'a', '']);
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'C2') {
                done([
                    [1, null, 3],
                    ['a', 4, 'c'],
                ]);
            }
        });

        expect(parser.parse('COUNTIF(foo, ">1")')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('COUNTIF(A1:C2, ">1")')).toMatchObject({ error: null, result: 2 });
        expect(parser.parse('COUNTIF([0, 1, 0, 1, 0], 0)')).toMatchObject({ error: null, result: 3 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COUNTIFS', (parser) => {
        parser.setVariable('foo', [1, null, 3, 'a', '']);
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'C2') {
                done([
                    [1, null, 3],
                    ['a', 4, 'c'],
                ]);
            }
        });

        expect(parser.parse('COUNTIFS(foo, ">1")')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('COUNTIFS(A1:C2, ">1")')).toMatchObject({ error: null, result: 2 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COUNTIN', (parser) => {
        parser.setVariable('foo', [1, 1, 2, 2, 2]);

        expect(parser.parse('COUNTIN(foo, 1)')).toMatchObject({ error: null, result: 2 });
        expect(parser.parse('COUNTIN(foo, 2)')).toMatchObject({ error: null, result: 3 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COUNTUNIQUE', (parser) => {
        expect(parser.parse('COUNTUNIQUE()')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('COUNTUNIQUE(1, 1, 2, 2, 3)')).toMatchObject({ error: null, result: 3 });
        expect(parser.parse('COUNTUNIQUE(1, 1, 2, 2, 3, "a", "a")')).toMatchObject({ error: null, result: 4 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COVARIANCE.P', (parser) => {
        parser.setVariable('foo', [3, 2, 4, 5, 6]);
        parser.setVariable('bar', [9, 7, 12, 15, 17]);

        expect(parser.parse('COVARIANCE.P(foo, bar)')).toMatchObject({ error: null, result: 5.2 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COVARIANCE.S', (parser) => {
        parser.setVariable('foo', [2, 4, 8]);
        parser.setVariable('bar', [5, 11, 12]);

        expect(parser.parse('COVARIANCE.S(foo, bar)')).toBeMatchCloseTo({ error: null, result: 9.666666666 });
    });

    it.each([new Parser(), ClickUpParser.create()])('DEVSQ', (parser) => {
        parser.setVariable('foo', [4, 5, 8, 7, 11, 4, 3]);

        expect(parser.parse('DEVSQ(foo)')).toMatchObject({ error: null, result: 48 });
    });

    it.each([new Parser(), ClickUpParser.create()])('EXPONDIST', (parser) => {
        expect(parser.parse('EXPONDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('EXPONDIST(0.2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('EXPONDIST(0.2, 10)')).toBeMatchCloseTo({ error: null, result: 1.353352832366127 });
        expect(parser.parse('EXPONDIST(0.2, 10, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.8646647167633873 });
        expect(parser.parse('EXPON.DIST(0.2, 10, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.8646647167633873 });
    });

    it.each([new Parser(), ClickUpParser.create()])('FDIST', (parser) => {
        expect(parser.parse('FDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FDIST(15)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FDIST(15, 6)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FDIST(15, 6, 4)')).toBeMatchCloseTo({ error: null, result: 0.0012714469079329002 });
        expect(parser.parse('FDIST(15, 6, 4, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.9897419523940192 });
        expect(parser.parse('F.DIST(15, 6, 4, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.9897419523940192 });
    });

    it.each([new Parser(), ClickUpParser.create()])('FDISTRT', (parser) => {
        expect(parser.parse('FDISTRT()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('FDISTRT(15)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('FDISTRT(15, 6)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('FDISTRT(15, 6, 4)')).toBeMatchCloseTo({ error: null, result: 0.010258047605980813 });
        expect(parser.parse('F.DIST.RT(15, 6, 4)')).toBeMatchCloseTo({ error: null, result: 0.010258047605980813 });
    });

    it.each([new Parser(), ClickUpParser.create()])('FINV', (parser) => {
        expect(parser.parse('FINV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FINV(0.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FINV(0.1, 6)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FINV(0.1, 6, 4)')).toBeMatchCloseTo({ error: null, result: 0.31438998832176834 });
        expect(parser.parse('F.INV(0.1, 6, 4)')).toBeMatchCloseTo({ error: null, result: 0.31438998832176834 });
    });

    it.each([new Parser(), ClickUpParser.create()])('FINVRT', (parser) => {
        expect(parser.parse('FINVRT()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('FINVRT(0.1)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('FINVRT(0.1, 6)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('FINVRT(0.1, 6, 4)')).toBeMatchCloseTo({ error: null, result: 4.009749312673947 });
        expect(parser.parse('F.INV.RT(0.1, 6, 4)')).toBeMatchCloseTo({ error: null, result: 4.009749312673947 });
    });

    it.each([new Parser(), ClickUpParser.create()])('FISHER', (parser) => {
        expect(parser.parse('FISHER()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FISHER(0.1)')).toBeMatchCloseTo({ error: null, result: 0.10033534773107562 });
        expect(parser.parse('FISHER(1)')).toMatchObject({ error: null, result: Infinity });
    });

    it.each([new Parser(), ClickUpParser.create()])('FISHERINV', (parser) => {
        expect(parser.parse('FISHERINV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('FISHERINV(0.1)')).toBeMatchCloseTo({ error: null, result: 0.09966799462495583 });
        expect(parser.parse('FISHERINV(1)')).toBeMatchCloseTo({ error: null, result: 0.761594155955765 });
    });

    it.each([new Parser(), ClickUpParser.create()])('FORECAST', (parser) => {
        parser.setVariable('foo', [6, 7, 9, 15, 21]);
        parser.setVariable('bar', [20, 28, 31, 38, 40]);

        expect(parser.parse('FORECAST(30, foo, bar)')).toBeMatchCloseTo({ error: null, result: 10.607253086419755 });
    });

    it.each([new Parser(), ClickUpParser.create()])('FREQUENCY', (parser) => {
        parser.setVariable('foo', [79, 85, 78, 85, 50, 81, 95, 88, 97]);
        parser.setVariable('bar', [70, 79, 89]);

        expect(parser.parse('FREQUENCY(foo, bar)')).toMatchObject({ error: null, result: [1, 2, 4, 2] });
    });

    it.each([new Parser(), ClickUpParser.create()])('GAMMA', (parser) => {
        expect(parser.parse('GAMMA()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('GAMMA(0.1)')).toBeMatchCloseTo({ error: null, result: 9.51350769866877 });
    });

    it.each([new Parser(), ClickUpParser.create()])('GAMMADIST', (parser) => {
        expect(parser.parse('GAMMADIST()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('GAMMADIST(1)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('GAMMADIST(1, 3)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('GAMMADIST(1, 3, 7)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('GAMMADIST(1, 3, 7, TRUE)')).toBeMatchCloseTo({
            error: null,
            result: 0.00043670743091302124,
        });
        expect(parser.parse('GAMMA.DIST(1, 3, 7, TRUE)')).toBeMatchCloseTo({
            error: null,
            result: 0.00043670743091302124,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('GAMMAINV', (parser) => {
        expect(parser.parse('GAMMAINV()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('GAMMAINV(1)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('GAMMAINV(1, 3)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('GAMMAINV(1, 3, 7)')).toBeMatchCloseTo({ error: null, result: 1233.435565298214 });
        expect(parser.parse('GAMMA.INV(1, 3, 7)')).toBeMatchCloseTo({ error: null, result: 1233.435565298214 });
    });

    it.each([new Parser(), ClickUpParser.create()])('GAMMALN', (parser) => {
        expect(parser.parse('GAMMALN()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('GAMMALN(4)')).toBeMatchCloseTo({ error: null, result: 1.7917594692280547 });
    });

    it.each([new Parser(), ClickUpParser.create()])('GAMMALN.PRECISE', (parser) => {
        expect(parser.parse('GAMMALN.PRECISE()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('GAMMALN.PRECISE(4)')).toBeMatchCloseTo({ error: null, result: 1.7917594692280547 });
    });

    it.each([new Parser(), ClickUpParser.create()])('GAUSS', (parser) => {
        expect(parser.parse('GAUSS()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('GAUSS(4)')).toBeMatchCloseTo({ error: null, result: 0.4999683287581669 });
    });

    it.each([new Parser(), ClickUpParser.create()])('GEOMEAN', (parser) => {
        parser.setVariable('foo', [4, 5, 8, 7, 11, 4, 3]);

        expect(parser.parse('GEOMEAN(foo)')).toBeMatchCloseTo({ error: null, result: 5.476986969656962 });
    });

    it.each([new Parser(), ClickUpParser.create()])('GROWTH', (parser) => {
        parser.setVariable('foo', [33100, 47300, 69000, 102000, 150000, 220000]);
        parser.setVariable('bar', [11, 12, 13, 14, 15, 16]);
        parser.setVariable('baz', [11, 12, 13, 14, 15, 16, 17, 18, 19]);

        const result = parser.parse('GROWTH(foo, bar, baz)');

        expect(result.error).toBeNull();
        expect(result.result[0]).toBeCloseTo(32618.20377353843);
        expect(result.result[1]).toBeCloseTo(47729.422614746654);
        expect(result.result[2]).toBeCloseTo(69841.30085621699);
        expect(result.result[3]).toBeCloseTo(102197.07337883323);
        expect(result.result[4]).toBeCloseTo(149542.4867400496);
        expect(result.result[5]).toBeCloseTo(218821.8762146044);
        expect(result.result[6]).toBeCloseTo(320196.71836349065);
        expect(result.result[7]).toBeCloseTo(468536.05418408196);
        expect(result.result[8]).toBeCloseTo(685597.3889812973);
    });

    it.each([new Parser(), ClickUpParser.create()])('HARMEAN', (parser) => {
        parser.setVariable('foo', [4, 5, 8, 7, 11, 4, 3]);

        expect(parser.parse('HARMEAN(foo)')).toBeMatchCloseTo({ error: null, result: 5.028375962061728 });
    });

    it.each([new Parser(), ClickUpParser.create()])('HYPGEOMDIST', (parser) => {
        expect(parser.parse('HYPGEOMDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('HYPGEOMDIST(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('HYPGEOMDIST(1, 4)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('HYPGEOMDIST(1, 4, 8)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('HYPGEOMDIST(1, 4, 8, 20)')).toBeMatchCloseTo({ error: null, result: 0.3632610939112487 });
        expect(parser.parse('HYPGEOMDIST(1, 4, 8, 20, TRUE)')).toBeMatchCloseTo({
            error: null,
            result: 0.46542827657378744,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('INTERCEPT', (parser) => {
        parser.setVariable('foo', [2, 3, 9, 1, 8]);
        parser.setVariable('bar', [6, 5, 11, 7, 5]);

        expect(parser.parse('INTERCEPT(foo, bar)')).toBeMatchCloseTo({ error: null, result: 0.04838709677419217 });
    });

    it.each([new Parser(), ClickUpParser.create()])('KURT', (parser) => {
        parser.setVariable('foo', [3, 4, 5, 2, 3, 4, 5, 6, 4, 7]);
        parser.setVariable('bar', [3, 4, 5, 2, 3, 4, 5, 'dewdwe', 4, 7]);

        expect(parser.parse('KURT(foo)')).toBeMatchCloseTo({ error: null, result: -0.15179963720841627 });
        expect(parser.parse('KURT(bar)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('LARGE', (parser) => {
        parser.setVariable('foo', [3, 5, 3, 5, 4]);
        parser.setVariable('bar', [3, 5, 3, 'dwedwed', 4]);

        expect(parser.parse('LARGE(foo, 3)')).toMatchObject({ error: null, result: 4 });
        expect(parser.parse('LARGE(bar, 3)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('LINEST', (parser) => {
        parser.setVariable('foo', [1, 9, 5, 7]);
        parser.setVariable('bar', [0, 4, 2, 3]);

        expect(parser.parse('LINEST(foo, bar)')).toMatchObject({ error: null, result: [2, 1] });
        expect(parser.parse('LINEST(foo, "aaaaaa")')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('LOGEST', (parser) => {
        parser.setVariable('foo', [1, 9, 5, 7]);
        parser.setVariable('bar', [0, 4, 2, 3]);

        expect(parser.parse('LOGEST(foo, bar)')).toMatchObject({ error: null, result: [1.751116, 1.194316] });
        expect(parser.parse('LOGEST(foo, "aaaaaa")')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('LOGNORMDIST', (parser) => {
        expect(parser.parse('LOGNORMDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LOGNORMDIST(4)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LOGNORMDIST(4, 3.5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LOGNORMDIST(4, 3.5, 1.2)')).toBeMatchCloseTo({ error: null, result: 0.01761759668181924 });
        expect(parser.parse('LOGNORMDIST(4, 3.5, 1.2, TRUE)')).toBeMatchCloseTo({
            error: null,
            result: 0.0390835557068005,
        });
        expect(parser.parse('LOGNORM.DIST(4, 3.5, 1.2, TRUE)')).toBeMatchCloseTo({
            error: null,
            result: 0.0390835557068005,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('LOGNORMINV', (parser) => {
        expect(parser.parse('LOGNORMINV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LOGNORMINV(0.0390835557068005)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LOGNORMINV(0.0390835557068005, 3.5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('LOGNORMINV(0.0390835557068005, 3.5, 1.2)')).toBeMatchCloseTo({ error: null, result: 4 });
        expect(parser.parse('LOGNORM.INV(0.0390835557068005, 3.5, 1.2)')).toBeMatchCloseTo({ error: null, result: 4 });
    });

    it.each([new Parser(), ClickUpParser.create()])('MAX', (parser) => {
        expect(parser.parse('MAX()')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('MAX(-1, 9, 9.2, 4, "foo", TRUE)')).toMatchObject({ error: null, result: 9.2 });
    });

    it.each([new Parser(), ClickUpParser.create()])('MAXA', (parser) => {
        expect(parser.parse('MAXA()')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('MAXA(-1, 9, 9.2, 4, "foo", TRUE)')).toMatchObject({ error: null, result: 9.2 });
    });

    it.each([new Parser(), ClickUpParser.create()])('MEDIAN', (parser) => {
        expect(parser.parse('MEDIAN()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('MEDIAN(1, 9, 9.2, 4)')).toMatchObject({ error: null, result: 6.5 });
    });

    it.each([new Parser(), ClickUpParser.create()])('MIN', (parser) => {
        expect(parser.parse('MIN()')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('MIN(-1.1, 9, 9.2, 4, "foo", TRUE)')).toMatchObject({ error: null, result: -1.1 });
    });

    it.each([new Parser(), ClickUpParser.create()])('MINA', (parser) => {
        expect(parser.parse('MINA()')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('MINA(-1.1, 9, 9.2, 4, "foo", TRUE)')).toMatchObject({ error: null, result: -1.1 });
    });

    it.each([new Parser(), ClickUpParser.create()])('MODEMULT', (parser) => {
        parser.setVariable('foo', [1, 2, 3, 4, 3, 2, 1, 2, 3, 5, 6, 1]);
        parser.setVariable('bar', [1, 2, 'dewdew', 4, 3, 2, 1, 2, 3, 5, 6, 1]);

        expect(parser.parse('MODEMULT(foo)')).toMatchObject({ error: null, result: [2, 3, 1] });
        expect(parser.parse('MODE.MULT(foo)')).toMatchObject({ error: null, result: [2, 3, 1] });
        expect(parser.parse('MODEMULT(bar)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('MODESNGL', (parser) => {
        parser.setVariable('foo', [5.6, 4, 4, 3, 2, 4]);
        parser.setVariable('bar', [5.6, 'dewdew', 4, 3, 2, 4]);

        expect(parser.parse('MODESNGL(foo)')).toMatchObject({ error: null, result: 4 });
        expect(parser.parse('MODE.SNGL(foo)')).toMatchObject({ error: null, result: 4 });
        expect(parser.parse('MODESNGL(bar)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('NEGBINOMDIST', (parser) => {
        expect(parser.parse('NEGBINOMDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NEGBINOMDIST(10)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NEGBINOMDIST(10, 5)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NEGBINOMDIST(10, 5, 0.25)')).toBeMatchCloseTo({
            error: null,
            result: 0.05504866037517786,
        });
        expect(parser.parse('NEGBINOMDIST(10, 5, 0.25, TRUE)')).toBeMatchCloseTo({
            error: null,
            result: 0.3135140584781766,
        });
        expect(parser.parse('NEGBINOM.DIST(10, 5, 0.25, TRUE)')).toBeMatchCloseTo({
            error: null,
            result: 0.3135140584781766,
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('NORMDIST', (parser) => {
        expect(parser.parse('NORMDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NORMDIST(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NORMDIST(1, 0)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NORMDIST(1, 0, 1)')).toBeMatchCloseTo({ error: null, result: 0.24197072451914337 });
        expect(parser.parse('NORMDIST(1, 0, 1, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.8413447460685429 });
        expect(parser.parse('NORM.DIST(1, 0, 1, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.8413447460685429 });
    });

    it.each([new Parser(), ClickUpParser.create()])('NORMINV', (parser) => {
        expect(parser.parse('NORMINV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NORMINV(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NORMINV(1, 0)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NORMINV(1, 0, 1)')).toBeMatchCloseTo({ error: null, result: 141.4213562373095 });
        expect(parser.parse('NORM.INV(1, 0, 1)')).toBeMatchCloseTo({ error: null, result: 141.4213562373095 });
    });

    it.each([new Parser(), ClickUpParser.create()])('NORMSDIST', (parser) => {
        expect(parser.parse('NORMSDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NORMSDIST(1)')).toBeMatchCloseTo({ error: null, result: 0.24197072451914337 });
        expect(parser.parse('NORMSDIST(1, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.8413447460685429 });
        expect(parser.parse('NORM.S.DIST(1, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.8413447460685429 });
    });

    it.each([new Parser(), ClickUpParser.create()])('NORMSINV', (parser) => {
        expect(parser.parse('NORMSINV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('NORMSINV(1)')).toBeMatchCloseTo({ error: null, result: 141.4213562373095 });
        expect(parser.parse('NORM.S.INV(1)')).toBeMatchCloseTo({ error: null, result: 141.4213562373095 });
    });

    it.each([new Parser(), ClickUpParser.create()])('PEARSON', (parser) => {
        parser.setVariable('foo', [9, 7, 5, 3, 1]);
        parser.setVariable('bar', [10, 6, 1, 5, 3]);
        parser.setVariable('baz', [10, 'dewdewd', 1, 5, 3]);

        expect(parser.parse('PEARSON(foo, bar)')).toBeMatchCloseTo({ error: null, result: 0.6993786061802354 });
        expect(parser.parse('PEARSON(foo, baz)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('PERCENTILEEXC', (parser) => {
        parser.setVariable('foo', [1, 2, 3, 4]);
        parser.setVariable('bar', [1, 'dewdew', 3, 4]);

        expect(parser.parse('PERCENTILEEXC(foo, 0)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('PERCENTILEEXC(foo, 0.5)')).toMatchObject({ error: null, result: 2.5 });
        expect(parser.parse('PERCENTILEEXC(bar, 0.5)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('PERCENTILEINC', (parser) => {
        parser.setVariable('foo', [1, 2, 3, 4]);
        parser.setVariable('bar', [1, 'dewdew', 3, 4]);

        expect(parser.parse('PERCENTILEINC(foo, 0)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('PERCENTILEINC(foo, 0.5)')).toMatchObject({ error: null, result: 2.5 });
        expect(parser.parse('PERCENTILEINC(bar, 0.5)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('PERCENTRANKEXC', (parser) => {
        parser.setVariable('foo', [1, 2, 3, 4]);
        parser.setVariable('bar', [1, 'dewdew', 3, 4]);

        expect(parser.parse('PERCENTRANKEXC(foo, 1)')).toMatchObject({ error: null, result: 0.2 });
        expect(parser.parse('PERCENTRANKEXC(foo, 4)')).toMatchObject({ error: null, result: 0.8 });
        expect(parser.parse('PERCENTRANKEXC(bar, 4)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('PERCENTRANKINC', (parser) => {
        parser.setVariable('foo', [1, 2, 3, 4]);
        parser.setVariable('bar', [1, 'dewdew', 3, 4]);

        expect(parser.parse('PERCENTRANKINC(foo, 1)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('PERCENTRANKINC(foo, 4)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('PERCENTRANKINC(bar, 4)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('PERMUT', (parser) => {
        expect(parser.parse('PERMUT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PERMUT(10)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PERMUT(10, 3)')).toMatchObject({ error: null, result: 720 });
    });

    it.each([new Parser(), ClickUpParser.create()])('PERMUTATIONA', (parser) => {
        expect(parser.parse('PERMUTATIONA()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PERMUTATIONA(10)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PERMUTATIONA(10, 3)')).toMatchObject({ error: null, result: 1000 });
    });

    it.each([new Parser(), ClickUpParser.create()])('PHI', (parser) => {
        expect(parser.parse('PHI()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('PHI(1)')).toBeMatchCloseTo({ error: null, result: 0.24197072451914337 });
    });

    it.each([new Parser(), ClickUpParser.create()])('POISSONDIST', (parser) => {
        expect(parser.parse('POISSONDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('POISSONDIST(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('POISSONDIST(1, 3)')).toBeMatchCloseTo({ error: null, result: 0.14936120510359185 });
        expect(parser.parse('POISSONDIST(1, 3, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.1991482734714558 });
        expect(parser.parse('POISSON.DIST(1, 3, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.1991482734714558 });
    });

    it.each([new Parser(), ClickUpParser.create()])('PROB', (parser) => {
        parser.setVariable('foo', [0, 1, 2, 3]);
        parser.setVariable('bar', [0.2, 0.3, 0.1, 0.4]);
        parser.setVariable('baz', [0, 'dewd', 2, 3]);

        expect(parser.parse('PROB(foo, bar, 2)')).toMatchObject({ error: null, result: 0.1 });
        expect(parser.parse('PROB(foo, bar, 1, 3)')).toMatchObject({ error: null, result: 0.8 });
        expect(parser.parse('PROB(foo, bar)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('PROB(baz, bar, 1, 3)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('QUARTILEEXC', (parser) => {
        parser.setVariable('foo', [6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49]);

        expect(parser.parse('QUARTILEEXC(foo, 1)')).toMatchObject({ error: null, result: 15 });
        expect(parser.parse('QUARTILEEXC(foo, 2)')).toMatchObject({ error: null, result: 40 });
        expect(parser.parse('QUARTILE.EXC(foo, 2)')).toMatchObject({ error: null, result: 40 });
        expect(parser.parse('QUARTILEEXC(foo, 4)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('QUARTILEEXC(foo, "dwe")')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('QUARTILEINC', (parser) => {
        parser.setVariable('foo', [1, 2, 4, 7, 8, 9, 10, 12]);

        expect(parser.parse('QUARTILEINC(foo, 1)')).toMatchObject({ error: null, result: 3.5 });
        expect(parser.parse('QUARTILEINC(foo, 2)')).toMatchObject({ error: null, result: 7.5 });
        expect(parser.parse('QUARTILE.INC(foo, 2)')).toMatchObject({ error: null, result: 7.5 });
        expect(parser.parse('QUARTILEINC(foo, 4)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('QUARTILEINC(foo, "dwe")')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('RANKAVG', (parser) => {
        parser.setVariable('foo', [89, 88, 92, 101, 94, 97, 95]);

        expect(parser.parse('RANKAVG(94, foo)')).toMatchObject({ error: null, result: 4 });
        expect(parser.parse('RANKAVG(88, foo, 1)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('RANK.AVG(88, foo, 1)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('RANKAVG("dwe", foo, 1)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('RANKEQ', (parser) => {
        parser.setVariable('foo', [7, 3.5, 3.5, 1, 2]);

        expect(parser.parse('RANKEQ(7, foo, 1)')).toMatchObject({ error: null, result: 5 });
        expect(parser.parse('RANKEQ(2, foo)')).toMatchObject({ error: null, result: 4 });
        expect(parser.parse('RANK.EQ(2, foo)')).toMatchObject({ error: null, result: 4 });
        expect(parser.parse('RANKEQ("dwe", foo, TRUE)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('ROW', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'C2') {
                done([
                    [1, 2],
                    [2, 3],
                    [2, 4],
                ]);
            }
        });

        expect(parser.parse('ROW()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('ROW(A1:C2)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('ROW(A1:C2, -1)')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('ROW(A1:C2, 0)')).toMatchObject({ error: null, result: [1, 2] });
        expect(parser.parse('ROW(A1:C2, 2)')).toMatchObject({ error: null, result: [2, 4] });
    });

    it.each([new Parser(), ClickUpParser.create()])('ROWS', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'C2') {
                done([
                    [1, 2],
                    [2, 3],
                    [2, 4],
                ]);
            }
        });

        expect(parser.parse('ROWS()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('ROWS(A1:C2)')).toMatchObject({ error: null, result: 3 });
    });

    it.each([new Parser(), ClickUpParser.create()])('RSQ', (parser) => {
        parser.setVariable('foo', [2, 3, 9, 1, 8, 7, 5]);
        parser.setVariable('bar', [6, 5, 11, 7, 5, 4, 4]);
        parser.setVariable('baz', [6, 'dwe', 11, 7, 5, 4, 4]);

        expect(parser.parse('RSQ(foo, bar)')).toBeMatchCloseTo({ error: null, result: 0.05795019157088122 });
        expect(parser.parse('RSQ(baz, bar)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('SKEW', (parser) => {
        parser.setVariable('foo', [3, 4, 5, 2, 3, 4, 5, 6, 4, 7]);
        parser.setVariable('bar', [3, 'dwe', 5, 2, 3, 4, 5, 6, 4, 7]);

        expect(parser.parse('SKEW(foo)')).toBeMatchCloseTo({ error: null, result: 0.3595430714067974 });
        expect(parser.parse('SKEW(bar)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('SKEWP', (parser) => {
        parser.setVariable('foo', [3, 4, 5, 2, 3, 4, 5, 6, 4, 7]);
        parser.setVariable('bar', [3, 'dwe', 5, 2, 3, 4, 5, 6, 4, 7]);

        expect(parser.parse('SKEWP(foo)')).toBeMatchCloseTo({ error: null, result: 0.303193339354144 });
        expect(parser.parse('SKEW.P(foo)')).toBeMatchCloseTo({ error: null, result: 0.303193339354144 });
        expect(parser.parse('SKEWP(bar)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('SKEW.P(bar)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('SLOPE', (parser) => {
        parser.setVariable('foo', [2, 3, 9, 1, 8, 7, 5]);
        parser.setVariable('bar', [6, 5, 11, 7, 5, 4, 4]);
        parser.setVariable('baz', [6, 'dwe', 11, 7, 5, 4, 4]);

        expect(parser.parse('SLOPE(foo, bar)')).toBeMatchCloseTo({ error: null, result: 0.3055555555555556 });
        expect(parser.parse('SLOPE(baz, bar)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('SMALL', (parser) => {
        parser.setVariable('foo', [3, 4, 5, 2, 3, 4, 6, 4, 7]);
        parser.setVariable('bar', [3, 4, 'dwe', 2, 3, 4, 6, 4, 7]);

        expect(parser.parse('SMALL(foo, 4)')).toMatchObject({ error: null, result: 4 });
        expect(parser.parse('SMALL(bar, 4)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('STANDARDIZE', (parser) => {
        expect(parser.parse('STANDARDIZE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('STANDARDIZE(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('STANDARDIZE(1, 3)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('STANDARDIZE(1, 3, 5)')).toMatchObject({ error: null, result: -0.4 });
    });

    it.each([new Parser(), ClickUpParser.create()])('STDEVP', (parser) => {
        parser.setVariable('foo', [1345, 1301, 1368, 1322, 1310, 1370, 1318, 1350, 1303, 1299]);

        expect(parser.parse('STDEVP(foo)')).toBeMatchCloseTo({ error: null, result: 26.054558142482477 });
        expect(parser.parse('STDEV.P(foo)')).toBeMatchCloseTo({ error: null, result: 26.054558142482477 });
    });

    it.each([new Parser(), ClickUpParser.create()])('STDEVS', (parser) => {
        parser.setVariable('foo', [1345, 1301, 1368, 1322, 1310, 1370, 1318, 1350, 1303, 1299]);

        expect(parser.parse('STDEVS(foo)')).toBeMatchCloseTo({ error: null, result: 27.46391571984349 });
        expect(parser.parse('STDEV.S(foo)')).toBeMatchCloseTo({ error: null, result: 27.46391571984349 });
    });

    it.each([new Parser(), ClickUpParser.create()])('STDEVA', (parser) => {
        parser.setVariable('foo', [1345, 1301, 1368, 1322, 1310, 1370, 1318, 1350, 1303, 1299]);

        expect(parser.parse('STDEVA(foo)')).toBeMatchCloseTo({ error: null, result: 27.46391571984349 });
    });

    it.each([new Parser(), ClickUpParser.create()])('STDEVPA', (parser) => {
        parser.setVariable('foo', [1345, 1301, 1368, 1322, 1310, 1370, 1318, 1350, 1303, 1299]);

        expect(parser.parse('STDEVPA(foo)')).toBeMatchCloseTo({ error: null, result: 26.054558142482477 });
    });

    it.each([new Parser(), ClickUpParser.create()])('STEYX', (parser) => {
        parser.setVariable('foo', [2, 3, 9, 1, 8, 7, 5]);
        parser.setVariable('bar', [6, 5, 11, 7, 5, 4, 4]);
        parser.setVariable('baz', [6, 5, 'dwe', 7, 5, 4, 4]);

        expect(parser.parse('STEYX(foo, bar)')).toBeMatchCloseTo({ error: null, result: 3.305718950210041 });
        expect(parser.parse('STEYX(baz, bar)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('TRANSPOSE', (parser) => {
        parser.on('callRangeValue', (a, b, done) => {
            if (a.label === 'A1' && b.label === 'C2') {
                done([
                    [1, 2],
                    [3, 4],
                    [5, 6],
                ]);
            } else if (a.label === 'A3' && b.label === 'C3') {
                done([1, 2, 3]);
            }
        });

        expect(parser.parse('TRANSPOSE()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('TRANSPOSE(A1:C2)')).toMatchObject({
            error: null,
            result: [
                [1, 3, 5],
                [2, 4, 6],
            ],
        });
        expect(parser.parse('TRANSPOSE(A3:C3)')).toMatchObject({ error: null, result: [[1], [2], [3]] });
    });

    it.each([new Parser(), ClickUpParser.create()])('TDIST', (parser) => {
        expect(parser.parse('TDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TDIST(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TDIST(1, 3)')).toBeMatchCloseTo({ error: null, result: 0.2067483346226397 });
        expect(parser.parse('TDIST(1, 3, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.8044988904727264 });
        expect(parser.parse('T.DIST(1, 3, TRUE)')).toBeMatchCloseTo({ error: null, result: 0.8044988904727264 });
    });

    it.each([new Parser(), ClickUpParser.create()])('T.DIST.2T', (parser) => {
        expect(parser.parse('T.DIST.2T()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('T.DIST.2T(1)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('T.DIST.2T(1, 6)')).toBeMatchCloseTo({ error: null, result: 0.3559176837495821 });
    });

    it.each([new Parser(), ClickUpParser.create()])('T.DIST.RT', (parser) => {
        expect(parser.parse('T.DIST.RT()')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('T.DIST.RT(1)')).toMatchObject({ error: '#N/A', result: null });
        expect(parser.parse('T.DIST.RT(1, 6)')).toBeMatchCloseTo({ error: null, result: 0.17795884187479105 });
    });

    it.each([new Parser(), ClickUpParser.create()])('TINV', (parser) => {
        expect(parser.parse('TINV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TINV(0.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('TINV(0.1, 6)')).toBeMatchCloseTo({ error: null, result: -1.4397557472652736 });
        expect(parser.parse('T.INV(0.1, 6)')).toBeMatchCloseTo({ error: null, result: -1.4397557472652736 });
    });

    it.each([new Parser(), ClickUpParser.create()])('T.INV.2T', (parser) => {
        expect(parser.parse('T.INV.2T()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('T.INV.2T(0.1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('T.INV.2T(0.1, 6)')).toBeMatchCloseTo({ error: null, result: 1.9431802743487372 });
    });

    it.each([new Parser(), ClickUpParser.create()])('TREND', (parser) => {
        parser.setVariable('foo', [1, 9, 5, 7]);
        parser.setVariable('bar', [0, 4, 2, 3]);
        parser.setVariable('baz', [5, 8]);

        expect(parser.parse('TREND(foo, bar, baz)')).toMatchObject({ error: null, result: [11, 17] });
        expect(parser.parse('TREND(foo, bar, "dwe")')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('TRIMMEAN', (parser) => {
        parser.setVariable('foo', [4, 5, 6, 7, 2, 3, 4, 5, 1, 2, 3]);
        parser.setVariable('bar', [4, 5, 'dwe', 7, 2, 3, 4, 5, 1, 2, 3]);

        expect(parser.parse('TRIMMEAN(foo, 0.2)')).toBeMatchCloseTo({ error: null, result: 3.777777777777 });
        expect(parser.parse('TRIMMEAN(bar, 0.2)')).toMatchObject({ error: '#VALUE!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('VARP', (parser) => {
        expect(parser.parse('VARP()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('VARP(1)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('VARP(1, 2)')).toBeMatchCloseTo({ error: null, result: 0.25 });
        expect(parser.parse('VARP(1, 2, 3)')).toBeMatchCloseTo({ error: null, result: 0.6666666666 });
        expect(parser.parse('VARP(1, 2, 3, 4)')).toBeMatchCloseTo({ error: null, result: 1.25 });
        expect(parser.parse('VAR.P(1, 2, 3, 4)')).toBeMatchCloseTo({ error: null, result: 1.25 });
    });

    it.each([new Parser(), ClickUpParser.create()])('VARS', (parser) => {
        expect(parser.parse('VARS()')).toMatchObject({ error: null, result: -0 });
        expect(parser.parse('VARS(1)')).toBeMatchCloseTo({ error: null, result: NaN });
        expect(parser.parse('VARS(1, 2)')).toBeMatchCloseTo({ error: null, result: 0.5 });
        expect(parser.parse('VARS(1, 2, 3)')).toBeMatchCloseTo({ error: null, result: 1 });
        expect(parser.parse('VARS(1, 2, 3, 4)')).toBeMatchCloseTo({ error: null, result: 1.6666666666666 });
        expect(parser.parse('VAR.S(1, 2, 3, 4)')).toBeMatchCloseTo({ error: null, result: 1.6666666666666 });
        expect(parser.parse('VAR.S(1, 2, 3, 4, TRUE, "foo")')).toBeMatchCloseTo({ error: null, result: 1.66666666666 });
    });

    it.each([new Parser(), ClickUpParser.create()])('VARA', (parser) => {
        expect(parser.parse('VARA()')).toMatchObject({ error: null, result: -0 });
        expect(parser.parse('VARA(1)')).toBeMatchCloseTo({ error: null, result: NaN });
        expect(parser.parse('VARA(1, 2)')).toBeMatchCloseTo({ error: null, result: 0.5 });
        expect(parser.parse('VARA(1, 2, 3)')).toBeMatchCloseTo({ error: null, result: 1 });
        expect(parser.parse('VARA(1, 2, 3, 4)')).toBeMatchCloseTo({ error: null, result: 1.666666666666 });
        expect(parser.parse('VARA(1, 2, 3, 4, TRUE, "foo")')).toBeMatchCloseTo({ error: null, result: 2.166666666666 });
    });

    it.each([new Parser(), ClickUpParser.create()])('VARPA', (parser) => {
        expect(parser.parse('VARPA()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('VARPA(1)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('VARPA(1, 2)')).toBeMatchCloseTo({ error: null, result: 0.25 });
        expect(parser.parse('VARPA(1, 2, 3)')).toBeMatchCloseTo({ error: null, result: 0.6666666666666 });
        expect(parser.parse('VARPA(1, 2, 3, 4)')).toBeMatchCloseTo({ error: null, result: 1.25 });
        expect(parser.parse('VARPA(1, 2, 3, 4, TRUE, "foo")')).toBeMatchCloseTo({ error: null, result: 1.80555555555 });
    });

    it.each([new Parser(), ClickUpParser.create()])('WEIBULLDIST', (parser) => {
        expect(parser.parse('WEIBULLDIST()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('WEIBULLDIST(1)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('WEIBULLDIST(1, 2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('WEIBULLDIST(1, 2, 3)')).toBeMatchCloseTo({ error: null, result: 0.1988531815143044 });
        expect(parser.parse('WEIBULLDIST(1, 2, 3, TRUE)')).toBeMatchCloseTo({
            error: null,
            result: 0.10516068318563021,
        });
        expect(parser.parse('WEIBULL.DIST(1, 2, 3, TRUE)')).toBeMatchCloseTo({
            error: null,
            result: 0.10516068318563021,
        });
    });
});
