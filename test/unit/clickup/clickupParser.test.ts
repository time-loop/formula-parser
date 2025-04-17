import { ClickUpParser } from '../../../src/clickup/clickupParser';

describe('ClickUpParser', () => {
    const CF_1 = 'CUSTOM_FIELD_fd1a4b4d_2ca6_4be0_8c64_3beff02edeb2';
    const CF_2 = 'CUSTOM_FIELD_b1c66306_e203_45b4_b0ac_1846590486ae';
    const CF_3 = 'NOT_PREFIXED_VARIABLE_ca7d5693_88d6_46dc_9243_f0c5e5622d7e';

    it('should accept regular variables', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, 10);
        parser.setVariable(CF_2, 20);
        parser.setVariable(CF_3, 30);
        const formula = `SUM(${CF_1}, ${CF_2}, ${CF_3})`;

        const result = parser.parse(formula);

        expect(result).toEqual({ error: null, result: 60 });
    });

    it('should accept formula variables', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, 'SUM(10, 20, 30)', true);
        parser.setVariable(CF_2, 20);
        parser.setVariable(CF_3, 30);
        const formula = `SUM(${CF_1}, ${CF_2}, ${CF_3})`;

        const result = parser.parse(formula);

        expect(result).toEqual({ error: null, result: 110 });
    });

    it('should handle empty variables in internal formulas', () => {
        const parser = ClickUpParser.create();
        // empty variable
        parser.setVariable(CF_1, null);
        // formula using empty variable
        // this formula would normally return NaN, but called from a formula
        // we need to return null or we get #VALUE! error
        parser.setVariable(CF_2, `${CF_1} * 2`, true);
        // set variable
        parser.setVariable(CF_3, 50);
        // formula using set variable and a formula using empty variable
        const formula = `${CF_3} - ${CF_2}`;
        const result = parser.parse(formula);
        expect(result).toEqual({ error: null, result: Number.NaN });
    });

    it('should return error if formula variable is invalid', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, '100/0', true);
        parser.setVariable(CF_2, 20);
        parser.setVariable(CF_3, 30);

        const formula = `SUM(${CF_1}, ${CF_2}, ${CF_3})`;

        const result = parser.parse(formula);

        expect(result.error).toBe('#DIV/0!');
    });

    it('should return error if dependent formula is invalid', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, `${CF_2} / ${CF_3}`, true);
        parser.setVariable(CF_2, 100);
        parser.setVariable(CF_3, 0);

        const formula = `SUM(${CF_1}, ${CF_2}, ${CF_3})`;

        const result = parser.parse(formula);

        expect(result.error).toBe('#DIV/0!');
    });

    it('should return error if referenced variable is not found', () => {
        const parser = ClickUpParser.create();
        const formula = `SUM(${CF_1}, 30)`;

        const result = parser.parse(formula);

        expect(result.error).toBe('#NAME?');
    });

    it('should return error if circular dependency detected', () => {
        const parser = ClickUpParser.create(10);
        parser.setVariable(CF_1, `SUM(${CF_2}, 20)`, true);
        parser.setVariable(CF_2, `SUM(${CF_3}, 30)`, true);
        parser.setVariable(CF_3, `SUM(${CF_1}, 40)`, true);
        const formula = `SUM(${CF_1}, ${CF_2}, ${CF_3})`;

        const result = parser.parse(formula);

        expect(result.error).toBe('#CYCLE!');
    });

    it('should return error if max levels exceeded', () => {
        const parser = ClickUpParser.create(1);
        parser.setVariable(CF_1, `SUM(${CF_2}, ${CF_3})`, true);
        parser.setVariable(CF_2, `SUM(20, 30)`, true);
        parser.setVariable(CF_3, 20);
        const formula = `SUM(${CF_1}, ${CF_2})`;

        const result = parser.parse(formula);

        expect(result.error).toBe('#LEVEL!');
    });

    it('should not return error if max levels reached', () => {
        const parser = ClickUpParser.create(2);
        parser.setVariable(CF_1, `SUM(${CF_2}, ${CF_3})`, true);
        parser.setVariable(CF_2, `SUM(20, 30)`, true);
        parser.setVariable(CF_3, 20);
        const formula = `SUM(${CF_1}, ${CF_2})`;

        const result = parser.parse(formula);

        expect(result.result).toBe(120);
    });

    it('should accept null as a value', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, null);
        const formula = `${CF_1} + 20`;

        const result = parser.parse(formula);

        expect(result).toEqual({ error: null, result: 20 });
    });
});
