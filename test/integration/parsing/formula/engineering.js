import { ClickUpParser } from '../../../../src/clickup/clickupParser';
import Parser from '../../../../src/parser';

describe('.parse() engineering formulas', () => {
    it.each([new Parser(), ClickUpParser.create()])('BESSELI', (parser) => {
        expect(parser.parse('BESSELI()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BESSELI(1.4)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BESSELI(1.4, 1)')).toBeMatchCloseTo({ error: null, result: 0.8860919793963105 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BESSELJ', (parser) => {
        expect(parser.parse('BESSELJ()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BESSELJ(1.4)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BESSELJ(1.4, 1)')).toBeMatchCloseTo({ error: null, result: 0.5419477138848564 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BESSELK', (parser) => {
        expect(parser.parse('BESSELK()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BESSELK(1.4)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BESSELK(1.4, 1)')).toMatchObject({ error: null, result: 0.32083590550458985 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BESSELY', (parser) => {
        expect(parser.parse('BESSELY()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BESSELY(1.4)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BESSELY(1.4, 1)')).toMatchObject({ error: null, result: -0.47914697411134044 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BIN2DEC', (parser) => {
        expect(parser.parse('BIN2DEC()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('BIN2DEC(1010)')).toMatchObject({ error: null, result: 10 });
        expect(parser.parse('BIN2DEC(0)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('BIN2DEC(1)')).toMatchObject({ error: null, result: 1 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BIN2HEX', (parser) => {
        expect(parser.parse('BIN2HEX()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('BIN2HEX(1010)')).toMatchObject({ error: null, result: 'a' });
        expect(parser.parse('BIN2HEX(1010, 4)')).toMatchObject({ error: null, result: '000a' });
        expect(parser.parse('BIN2HEX(0, 3)')).toMatchObject({ error: null, result: '000' });
        expect(parser.parse('BIN2HEX(1111)')).toMatchObject({ error: null, result: 'f' });
    });

    it.each([new Parser(), ClickUpParser.create()])('BIN2OCT', (parser) => {
        expect(parser.parse('BIN2OCT()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('BIN2OCT(1010)')).toMatchObject({ error: null, result: '12' });
        expect(parser.parse('BIN2OCT(1010, 4)')).toMatchObject({ error: null, result: '0012' });
        expect(parser.parse('BIN2OCT(0, 3)')).toMatchObject({ error: null, result: '000' });
        expect(parser.parse('BIN2OCT(111)')).toMatchObject({ error: null, result: '7' });
    });

    it.each([new Parser(), ClickUpParser.create()])('BITAND', (parser) => {
        expect(parser.parse('BITAND()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITAND(2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITAND(2, 4)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('BITAND(1, 5)')).toMatchObject({ error: null, result: 1 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BITLSHIFT', (parser) => {
        expect(parser.parse('BITLSHIFT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITLSHIFT(2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITLSHIFT(2, 4)')).toMatchObject({ error: null, result: 32 });
        expect(parser.parse('BITLSHIFT(1, 5)')).toMatchObject({ error: null, result: 32 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BITOR', (parser) => {
        expect(parser.parse('BITOR()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITOR(2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITOR(2, 4)')).toMatchObject({ error: null, result: 6 });
        expect(parser.parse('BITOR(1, 5)')).toMatchObject({ error: null, result: 5 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BITRSHIFT', (parser) => {
        expect(parser.parse('BITRSHIFT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITRSHIFT(2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITRSHIFT(4, 2)')).toMatchObject({ error: null, result: 1 });
        expect(parser.parse('BITRSHIFT(1, 5)')).toMatchObject({ error: null, result: 0 });
    });

    it.each([new Parser(), ClickUpParser.create()])('BITXOR', (parser) => {
        expect(parser.parse('BITXOR()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITXOR(2)')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('BITXOR(4, 2)')).toMatchObject({ error: null, result: 6 });
        expect(parser.parse('BITXOR(1, 5)')).toMatchObject({ error: null, result: 4 });
    });

    it.each([new Parser(), ClickUpParser.create()])('COMPLEX', (parser) => {
        expect(parser.parse('COMPLEX()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('COMPLEX(2, 0)')).toMatchObject({ error: null, result: '2' });
        expect(parser.parse('COMPLEX(4, 2)')).toMatchObject({ error: null, result: '4+2i' });
        expect(parser.parse('COMPLEX(1, 5)')).toMatchObject({ error: null, result: '1+5i' });
    });

    it.each([new Parser(), ClickUpParser.create()])('CONVERT', (parser) => {
        expect(parser.parse('CONVERT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('CONVERT(1)')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('CONVERT(2, "lbm", "kg")')).toMatchObject({ error: null, result: 0.90718474 });
        expect(parser.parse('CONVERT(100, "km", "mi")')).toMatchObject({ error: null, result: 62.13711922373339 });
        expect(parser.parse('CONVERT(100, "km", "m")')).toMatchObject({ error: null, result: 100000 });
        expect(parser.parse('CONVERT(2, "km/h", "mi")')).toMatchObject({ error: '#N/A', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('DEC2BIN', (parser) => {
        expect(parser.parse('DEC2BIN()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DEC2BIN(10)')).toMatchObject({ error: null, result: '1010' });
        expect(parser.parse('DEC2BIN(0, 4)')).toMatchObject({ error: null, result: '0000' });
        expect(parser.parse('DEC2BIN(1)')).toMatchObject({ error: null, result: '1' });
    });

    it.each([new Parser(), ClickUpParser.create()])('DEC2HEX', (parser) => {
        expect(parser.parse('DEC2HEX()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DEC2HEX(100)')).toMatchObject({ error: null, result: '64' });
        expect(parser.parse('DEC2HEX(100, 4)')).toMatchObject({ error: null, result: '0064' });
        expect(parser.parse('DEC2HEX(0)')).toMatchObject({ error: null, result: '0' });
        expect(parser.parse('DEC2HEX(1)')).toMatchObject({ error: null, result: '1' });
    });

    it.each([new Parser(), ClickUpParser.create()])('DEC2OCT', (parser) => {
        expect(parser.parse('DEC2OCT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DEC2OCT(58)')).toMatchObject({ error: null, result: '72' });
        expect(parser.parse('DEC2OCT(58, 4)')).toMatchObject({ error: null, result: '0072' });
        expect(parser.parse('DEC2OCT(0)')).toMatchObject({ error: null, result: '0' });
        expect(parser.parse('DEC2OCT(1)')).toMatchObject({ error: null, result: '1' });
    });

    it.each([new Parser(), ClickUpParser.create()])('DELTA', (parser) => {
        expect(parser.parse('DELTA()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('DELTA(58)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('DELTA(58, 4)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('DELTA(58, 58)')).toMatchObject({ error: null, result: 1 });
    });

    it.each([new Parser(), ClickUpParser.create()])('ERF', (parser) => {
        expect(parser.parse('ERF()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ERF(1)')).toBeMatchCloseTo({ error: null, result: 0.8427007929497149 });
        expect(parser.parse('ERF(2)')).toBeMatchCloseTo({ error: null, result: 0.9953222650189527 });
    });

    it.each([new Parser(), ClickUpParser.create()])('ERFC', (parser) => {
        expect(parser.parse('ERFC()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('ERFC(0)')).toBeMatchCloseTo({ error: null, result: 1 });
        expect(parser.parse('ERFC(1)')).toBeMatchCloseTo({ error: null, result: 0.1572992070502851 });
    });

    it.each([new Parser(), ClickUpParser.create()])('GESTEP', (parser) => {
        expect(parser.parse('GESTEP()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('GESTEP(1, 2)')).toMatchObject({ error: null, result: 0 });
        expect(parser.parse('GESTEP(-1, -2)')).toMatchObject({ error: null, result: 1 });
    });

    it.each([new Parser(), ClickUpParser.create()])('HEX2BIN', (parser) => {
        expect(parser.parse('HEX2BIN()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('HEX2BIN("FA")')).toMatchObject({ error: null, result: '11111010' });
        expect(parser.parse('HEX2BIN("FA", 10)')).toMatchObject({ error: null, result: '0011111010' });
        expect(parser.parse('HEX2BIN(200)')).toMatchObject({ error: '#NUM!', result: null });
    });

    it.each([new Parser(), ClickUpParser.create()])('HEX2DEC', (parser) => {
        expect(parser.parse('HEX2DEC()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('HEX2DEC("FA")')).toMatchObject({ error: null, result: 250 });
        expect(parser.parse('HEX2DEC(200)')).toMatchObject({ error: null, result: 512 });
    });

    it.each([new Parser(), ClickUpParser.create()])('HEX2OCT', (parser) => {
        expect(parser.parse('HEX2OCT()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('HEX2OCT("FA")')).toMatchObject({ error: null, result: '372' });
        expect(parser.parse('HEX2OCT("FA", 6)')).toMatchObject({ error: null, result: '000372' });
        expect(parser.parse('HEX2OCT(200)')).toMatchObject({ error: null, result: '1000' });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMABS', (parser) => {
        expect(parser.parse('IMABS()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMABS("5+12i")')).toMatchObject({ error: null, result: 13 });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMAGINARY', (parser) => {
        expect(parser.parse('IMAGINARY()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMAGINARY("3+4i")')).toMatchObject({ error: null, result: 4 });
        expect(parser.parse('IMAGINARY("+i")')).toMatchObject({ error: null, result: '+1' });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMARGUMENT', (parser) => {
        expect(parser.parse('IMARGUMENT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMARGUMENT(1)')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('IMARGUMENT(0)')).toMatchObject({ error: '#DIV/0!', result: null });
        expect(parser.parse('IMARGUMENT("3+4i")')).toBeMatchCloseTo({ error: null, result: 0.9272952180016122 });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMCONJUGATE', (parser) => {
        expect(parser.parse('IMCONJUGATE()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMCONJUGATE(1)')).toMatchObject({ error: '#ERROR!', result: null });
        expect(parser.parse('IMCONJUGATE("3+4i")')).toMatchObject({ error: null, result: '3-4i' });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMCOS', (parser) => {
        expect(parser.parse('IMCOS()')).toMatchObject({ error: '#VALUE!', result: null });

        const result = parser.parse('IMCOS("3+4i")');

        expect(result.error).toBeNull();
        expect(parseFloat(result.result.split('-')[1])).toBeCloseTo(27.03494560307422);
        expect(parseFloat(result.result.split('-')[2])).toBeCloseTo(3.8511533348117766);
    });

    it.each([new Parser(), ClickUpParser.create()])('IMCOSH', (parser) => {
        expect(parser.parse('IMCOSH()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMCOSH("3+4i")')).toMatchObject({
            error: null,
            result: '-6.580663040551157-7.581552742746545i',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMCOT', (parser) => {
        expect(parser.parse('IMCOT()')).toMatchObject({ error: '#VALUE!', result: null });

        const result = parser.parse('IMCOT("3+4i")');

        expect(result.error).toBeNull();
        expect(parseFloat(result.result.split('-')[1])).toBeCloseTo(-0.0001875877379836712);
        expect(parseFloat(result.result.split('-')[2])).toBeCloseTo(1.0006443924715591);
    });

    it.each([new Parser(), ClickUpParser.create()])('IMCSC', (parser) => {
        expect(parser.parse('IMCSC()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('IMCSC("3+4i")')).toMatchObject({
            error: null,
            result: '0.005174473184019398+0.03627588962862602i',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMCSCH', (parser) => {
        expect(parser.parse('IMCSCH()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('IMCSCH("3+4i")')).toMatchObject({
            error: null,
            result: '-0.0648774713706355+0.0754898329158637i',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMDIV', (parser) => {
        expect(parser.parse('IMDIV()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMDIV("3+4i")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMDIV("3+4i", "2+2i")')).toMatchObject({ error: null, result: '1.75+0.25i' });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMEXP', (parser) => {
        expect(parser.parse('IMEXP()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMEXP("3+4i")')).toMatchObject({
            error: null,
            result: '-13.128783081462158-15.200784463067954i',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMLN', (parser) => {
        expect(parser.parse('IMLN()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMLN("3+4i")')).toMatchObject({
            error: null,
            result: '1.6094379124341003+0.9272952180016122i',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMLOG10', (parser) => {
        expect(parser.parse('IMLOG10()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMLOG10("3+4i")')).toMatchObject({
            error: null,
            result: '0.6989700043360187+0.4027191962733731i',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMLOG2', (parser) => {
        expect(parser.parse('IMLOG2()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMLOG2("3+4i")')).toMatchObject({
            error: null,
            result: '2.321928094887362+1.3378042124509761i',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMPOWER', (parser) => {
        expect(parser.parse('IMPOWER()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMPOWER("3+4i")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMPOWER("3+4i", 3)')).toMatchObject({ error: null, result: '-117+44.000000000000036i' });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMPRODUCT', (parser) => {
        expect(parser.parse('IMPRODUCT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMPRODUCT("3+4i")')).toMatchObject({ error: null, result: '3+4i' });
        expect(parser.parse('IMPRODUCT("3+4i", "1+2i")')).toMatchObject({ error: null, result: '-5+10i' });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMREAL', (parser) => {
        expect(parser.parse('IMREAL()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMREAL("3+4i")')).toMatchObject({ error: null, result: 3 });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMSEC', (parser) => {
        expect(parser.parse('IMSEC()')).toMatchObject({ error: '#VALUE!', result: null });

        const result = parser.parse('IMSEC("3+4i")');

        expect(result.error).toBeNull();
        expect(parseFloat(result.result.split('+')[0])).toBeCloseTo(-0.03625349691586888);
        expect(parseFloat(result.result.split('+')[1])).toBeCloseTo(0.005164344607753179);
    });

    it.each([new Parser(), ClickUpParser.create()])('IMSECH', (parser) => {
        expect(parser.parse('IMSECH()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMSECH("3+4i")')).toMatchObject({
            error: null,
            result: '-0.06529402785794704+0.07522496030277322i',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMSIN', (parser) => {
        expect(parser.parse('IMSIN()')).toMatchObject({ error: '#VALUE!', result: null });

        const result = parser.parse('IMSIN("3+4i")');

        expect(result.error).toBeNull();
        expect(parseFloat(result.result.split('-')[0])).toBeCloseTo(3.8537380379193764);
        expect(parseFloat(result.result.split('-')[1])).toBeCloseTo(27.01681325800393);
    });

    it.each([new Parser(), ClickUpParser.create()])('IMSINH', (parser) => {
        expect(parser.parse('IMSINH()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMSINH("3+4i")')).toMatchObject({
            error: null,
            result: '-6.5481200409110025-7.61923172032141i',
        });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMSQRT', (parser) => {
        expect(parser.parse('IMSQRT()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMSQRT("3+4i")')).toMatchObject({ error: null, result: '2+i' });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMSUB', (parser) => {
        expect(parser.parse('IMSUB()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMSUB("3+4i")')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMSUB("3+4i", "2+3i")')).toMatchObject({ error: null, result: '1+i' });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMSUM', (parser) => {
        expect(parser.parse('IMSUM()')).toMatchObject({ error: '#VALUE!', result: null });
        expect(parser.parse('IMSUM("3+4i")')).toMatchObject({ error: null, result: '3+4i' });
        expect(parser.parse('IMSUM("3+4i", "2+3i")')).toMatchObject({ error: null, result: '5+7i' });
    });

    it.each([new Parser(), ClickUpParser.create()])('IMTAN', (parser) => {
        expect(parser.parse('IMTAN()')).toMatchObject({ error: '#VALUE!', result: null });

        const result = parser.parse('IMTAN("3+4i")');

        expect(result.error).toBeNull();
        expect(parseFloat(result.result.split('+')[0])).toBeCloseTo(-0.00018734620462949037);
        expect(parseFloat(result.result.split('+')[1])).toBeCloseTo(0.9993559873814729);
    });

    it.each([new Parser(), ClickUpParser.create()])('OCT2BIN', (parser) => {
        expect(parser.parse('OCT2BIN()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('OCT2BIN(3)')).toMatchObject({ error: null, result: '11' });
        expect(parser.parse('OCT2BIN(3, 4)')).toMatchObject({ error: null, result: '0011' });
    });

    it.each([new Parser(), ClickUpParser.create()])('OCT2DEC', (parser) => {
        expect(parser.parse('OCT2DEC()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('OCT2DEC(3)')).toMatchObject({ error: null, result: 3 });
        expect(parser.parse('OCT2DEC(33)')).toMatchObject({ error: null, result: 27 });
    });

    it.each([new Parser(), ClickUpParser.create()])('OCT2HEX', (parser) => {
        expect(parser.parse('OCT2HEX()')).toMatchObject({ error: '#NUM!', result: null });
        expect(parser.parse('OCT2HEX(3)')).toMatchObject({ error: null, result: '3' });
        expect(parser.parse('OCT2HEX(33)')).toMatchObject({ error: null, result: '1b' });
        expect(parser.parse('OCT2HEX(33, 3)')).toMatchObject({ error: null, result: '01b' });
    });
});
