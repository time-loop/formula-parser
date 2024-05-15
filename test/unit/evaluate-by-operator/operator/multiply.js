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
        expect(() => func('foo', ' ', 'bar', ' baz')).toThrow('VALUE');
        expect(() => func('foo', 2)).toThrow('VALUE');
        expect(() => func(2, null)).toThrow('VALUE');
        expect(() => func(2, undefined)).toThrow('VALUE');
        expect(() => func(2, '')).toThrow('VALUE');
        expect(() => func(null, 2)).toThrow('VALUE');
        expect(() => func(undefined, 2)).toThrow('VALUE');
        expect(() => func('', 2)).toThrow('VALUE');
    });
});
