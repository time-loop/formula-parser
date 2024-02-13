import datesSubtractionRule from '../../../../src/clickup-parser/rules/dates-subtraction.rule';

describe('DatesSubtraction rule unit tests', () => {

  // it.each([])('Should not modify the formula: %s', (formula) => {
  //   expect(datesSubtractionRule(formula)).toBe(formula);
  // });

  it.each([[
    'DATE(2021, 01, 01) - DATE(2021, 01, 01)',
    'DAYS(DATE(2021, 01, 01), DATE(2021, 01, 01))',
  ], [
    'SUM(DATE(2021, 01, 01) - DATE(2021, 01, 01))',
    'SUM(DAYS(DATE(2021, 01, 01), DATE(2021, 01, 01)))',
  ],
    /**
     * TODO Add more test cases for TODAY, EOMONTH, ETC
     */
  ])('Should modify the formula from %s to %s', (formula, expected) => {
    expect(datesSubtractionRule(formula)).toBe(expected);
  });
});
