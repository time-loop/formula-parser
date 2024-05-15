import splitFormula from '../../../src/helper/formula';

describe('Formula unit tests', () => {
    const testCases = [
        ['DATE(2022, 4, 1)', 'DATE', [2022, 4, 1]],
        ['DAY(2024, 1, 1)', 'DAY', [2024, 1, 1]],
        ['COMPLEX.FORMULA(1,2,"abc")', 'COMPLEX.FORMULA', [1, 2, 'abc']],
        ['TODAY()', 'TODAY', []],
    ];

    it.each(testCases)('Should split the formula. Formula: %s', (formula, expectedName, expectedArgs) => {
        const { name, args } = splitFormula(formula);

        expect(name).toBe(expectedName);
        expect(args).toStrictEqual(expectedArgs);
    });
});
