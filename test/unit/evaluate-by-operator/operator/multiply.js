import func from '../../../../src/evaluate-by-operator/operator/multiply';

describe('multiply operator', () => {
    it('should set SYMBOL const', () => {
        expect(func.SYMBOL).toBe('*');
    });

    it('should correctly process values', () => {
        expect(func(2, 8.8)).toBe(17.6);
        expect(func('2', 8.8)).toBe(17.6);
        expect(func('2', '8.8')).toBe(17.6);
        expect(func('2', '-8.8', 6, 0.4)).toBe(-42.24000000000001);
        expect(func(2, null)).toBe(Number.NaN);
        expect(func(2, undefined)).toBe(Number.NaN);
        expect(func(null, 2)).toBe(Number.NaN);
        expect(func(undefined, 2)).toBe(Number.NaN);
        expect(func(2, '')).toBe(Number.NaN);
        expect(func('', 2)).toBe(Number.NaN);
        expect(() => func('foo', ' ', 'bar', ' baz')).toThrow('VALUE');
        expect(() => func('foo', 2)).toThrow('VALUE');
    });
});
