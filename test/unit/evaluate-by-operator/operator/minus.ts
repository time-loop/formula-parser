/* eslint-disable import/no-named-as-default-member */
import func from '../../../../src/evaluate-by-operator/operator/minus';
import ClickUpConfiguration from '../../../../src/clickup.config';

describe('minus operator', () => {
    it('should set SYMBOL const', () => {
        expect(func.SYMBOL).toBe('-');
    });

    it('should correctly process values', () => {
        expect(func(2, 8.8)).toBe(-6.800000000000001);
        expect(func('2', 8.8)).toBe(-6.800000000000001);
        expect(func('2', '8.8')).toBe(-6.800000000000001);
        expect(func('2', '-8.8', 6, 0.4)).toBe(4.4);
        expect(() => func('foo', ' ', 'bar', ' baz')).toThrow('VALUE');
        expect(() => func('foo', 2)).toThrow('VALUE');
    });

    describe('Dates subtraction', () => {
        beforeAll(() => {
            Object.assign(ClickUpConfiguration, {
                ConvertDatesToNumbers: true,
                ConvertFormulasInNumbers: true,
            });
        });

        afterAll(() => {
            Object.assign(ClickUpConfiguration, {
                ConvertDatesToNumbers: false,
                ConvertFormulasInNumbers: false,
            });
        });

        const testCases = [
            // simple formulas
            [0, 'DATE(2023,1,1)', 'DATE(2023,1,1)'],
            [0, 'DATE(2024,1,1)', 'DATE(2024,1,1)'],
            [-1, 'DATE(2024,1,1)', 'DATE(2024,1,2)'],
            [1, 'DATE(2024,1,2)', 'DATE(2024,1,1)'],
            [31, 'DATE(2024,2,1)', 'DATE(2024,1,1)'],
            [-31, 'DATE(2024,1,1)', 'DATE(2024,2,1)'],
            [-365, 'DATE(2022,1,1)', 'DATE(2023,1,1)'],
            [365, 'DATE(2023,1,1)', 'DATE(2022,1,1)'],
            // leap years
            [-366, 'DATE(2024,1,1)', 'DATE(2025,1,1)'],
            [366, 'DATE(2025,1,1)', 'DATE(2024,1,1)'],
        ];

        it.each(testCases)('Should correctly subtract dates. Should return %s', (expectedValue, first, second) => {
            expect(func(first, second)).toBe(expectedValue);
        });
    });
});
