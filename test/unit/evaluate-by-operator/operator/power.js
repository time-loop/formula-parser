import func from '../../../../src/evaluate-by-operator/operator/power';

describe('power operator', () => {
    it('should set SYMBOL const', () => {
        expect(func.SYMBOL).toBe('^');
    });

    it('should correctly process values', () => {
        expect(func(2, 8.8)).toBe(445.7218884076158);
        expect(func('2', 8.8)).toBe(445.7218884076158);
        expect(func('2', '8.8')).toBe(445.7218884076158);
        expect(func('2', '8.8')).toBe(445.7218884076158);
        expect(func(2, null)).toBe(Number.NaN);
        expect(func(2, undefined)).toBe(Number.NaN);
        expect(func(null, 2)).toBe(Number.NaN);
        expect(func(undefined, 2)).toBe(Number.NaN);
        expect(func(2, '')).toBe(Number.NaN);
        expect(func('', 2)).toBe(Number.NaN);
        expect(() => func('foo', ' ')).toThrow('VALUE');
        expect(() => func('foo', 2)).toThrow('VALUE');
    });
});
