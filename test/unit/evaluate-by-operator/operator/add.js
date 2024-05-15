import func from '../../../../src/evaluate-by-operator/operator/add';

describe('add operator', () => {
    it('should set SYMBOL const', () => {
        expect(func.SYMBOL).toBe('+');
    });

    it('should correctly process values', () => {
        expect(func(2, 8.8)).toBe(10.8);
        expect(func('2', 8.8)).toBe(10.8);
        expect(func('2', '8.8')).toBe(10.8);
        expect(func('2', '-8.8', 6, 0.4)).toBe(-0.4000000000000007);
        expect(() => func('foo', ' ', 'bar', ' baz')).toThrow('VALUE');
        expect(() => func('foo', 2)).toThrow('VALUE');
        expect(() => func(2, null)).toThrow('VALUE');
        expect(() => func(2, undefined)).toThrow('VALUE');
        expect(() => func(2, '')).toThrow('VALUE');
        expect(() => func(null, 2)).toThrow('VALUE');
        expect(() => func(undefined, 2)).toThrow('VALUE');
        expect(() => func('', 2)).toThrow('VALUE');
    });

    describe('ClickUp Overrides', () => {
        it.each(['DATE(2021,1,1)', 'SUM(DATE(2021,1,1))'])("Shouldn't parse dates or formulas", (formula) => {
            expect(() => func(formula)).toThrow('VALUE');
        });
    });
});
