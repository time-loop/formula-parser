import { ClickUpParser } from '../../../src/clickup/clickupParser';

describe('ClickUpParser', () => {
    const CF_1 = 'CUSTOM_FIELD_fd1a4b4d_2ca6_4be0_8c64_3beff02edeb2';
    const CF_2 = 'CUSTOM_FIELD_b1c66306_e203_45b4_b0ac_1846590486ae';

    it('should accept object variables', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, { type: 'number', value: 10 });
        parser.setVariable(CF_2, { type: 'number', value: 20 });
        const formula = `SUM(${CF_1}, ${CF_2})`;

        const result = parser.parse(formula);

        expect(result).toEqual({ error: null, result: 30 });
    });

    it('should accept formula variables', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, {
            type: 'formula',
            value: 'SUM(10, 20, 30)',
        });
        parser.setVariable(CF_2, { type: 'number', value: 20 });
        const formula = `SUM(${CF_1}, ${CF_2})`;

        const result = parser.parse(formula);

        expect(result).toEqual({ error: null, result: 80 });
    });

    it('should return error if formula variable is invalid', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, {
            type: 'formula',
            value: '100/0',
        });
        parser.setVariable(CF_2, { type: 'number', value: 20 });
        const formula = `SUM(${CF_1}, ${CF_2})`;

        const result = parser.parse(formula);

        expect(result.error).toBe('#DIV/0!');
    });
});
