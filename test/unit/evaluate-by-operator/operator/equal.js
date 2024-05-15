import func from '../../../../src/evaluate-by-operator/operator/equal';

describe('equal operator', () => {
    it('should set SYMBOL const', () => {
        expect(func.SYMBOL).toBe('=');
    });

    it('should correctly process values', () => {
        expect(func(2, 8.8)).toBe(false);
        expect(func('2', 8.8)).toBe(false);
        expect(func(1, '1')).toBe(false);
        expect(func(void 0, null)).toBe(false);
        expect(func(0, null)).toBe(false);
        expect(func(0, void 0)).toBe(false);
        expect(func(new Date(), new Date(Date.now() + 10))).toBe(false);

        expect(func(1, 1)).toBe(true);
        expect(func(null, null)).toBe(true);
        expect(func(void 0, void 0)).toBe(true);
        expect(func(new Date(), new Date())).toBe(true);
    });
});
