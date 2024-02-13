import Parser from '../../../src/parser';

describe('.parse()', () => {
  let parser;

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

  describe('ClickUp Overrides', () => {
    const dateTestCases = [
      [
        'SUM(DATE(2021,1,1) - 2)',
        18625,
      ],
      [
        'SUM(DATE(2021,1,1) - DATE(2021,1,2))',
        -1,
      ],
      [
        'SUM(DATE(2022,1,1) - DATE(2021,1,1))',
        365,
      ],
      [
        'CONCATENATE(DATE(2022,1,1) - DATE(2021,1,1))',
        '365',
      ],
    ];

    it.each(dateTestCases)('if the flag "USE_NUMERIC_OVERRIDES" is off, it should not calculate date subtraction', (formula, expectedResult) => {
      expect(parser.parse(formula)).toMatchObject({ error: '#VALUE!', result: null});
    });

    it.each(dateTestCases)('should calculate date subtraction', (formula, expectedResult) => {
      parser.setVariable('USE_NUMERIC_OVERRIDES', true);
      expect(parser.parse(formula)).toMatchObject({ error: null, result: expectedResult});
    });
  });
});
