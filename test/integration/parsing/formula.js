import Parser from '../../../src/parser';

describe('.parse()', () => {
  let parser;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    parser = new Parser();
  });
  afterEach(() => {
    parser = null;
  });

  it('should return error when number of arguments is not valid', () => {
    /* eslint-disable */
    expect(parser.parse('ACOTH("foo")')).toMatchObject({error: '#VALUE!', result: null});
    expect(parser.parse("ACOTH('foo')")).toMatchObject({error: '#VALUE!', result: null});
    /* eslint-enable */
  });

  it('should return error when used variable is not defined', () => {
    expect(parser.parse('ACOTH(foo)')).toMatchObject({error: '#NAME?', result: null});
  });

  it('should evaluate formula expression provided in lower case', () => {
    parser.setVariable('foo', [7, 3.5, 3.5, 1, 2]);

    expect(parser.parse('sum(2, 3, Rank.eq(2, foo))')).toMatchObject({error: null, result: 9});
  });

  describe('ClickupParser', () => {
    const testCases = [
      ['SUM(DATE(2022,1,1) - DATE(2021,1,1))', 365],
      ['SUM(DATE(2021,1,1) - DATE(2022,1,1), DATE(2024,1,1) - DATE(2023,2,2))', -32],

      /**
       * TODO MORE COMPLEX FORMULAS
       * TODO 2 OTHER DATE VARIABLES
       */

      ['SUM(TODAY() - DATE(2022,1,1), DATE(2024,1,1) - DATE(2023,2,2))', -32],
      ['SUM(TODAY() - TODAY()))', 0],
    ];

    describe('if USE_CLICKUP_PARSER is false', () => {
      it.each(testCases)('Should not parse dates subtraction for formula: %s', (formula) => {
        expect(parser.parse(formula)).toMatchObject({error: '#VALUE!', result: null});
      });
    });

    describe('if USE_CLICKUP_PARSER is true', () => {
      beforeEach(() => {
        parser.setVariable('USE_CLICKUP_PARSER', true);
      });

      it.each(testCases)('Should parse dates subtraction', (formula, expectedResult) => {
        expect(parser.parse(formula)).toMatchObject({error: null, result: expectedResult});
      });
    });
  });
});
