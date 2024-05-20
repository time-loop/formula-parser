import { ClickUpParser } from '../../../src/clickup/clickupParser';
import { createCustomFieldVariable } from '../../../src/clickup/customField';

describe('ClickUpParser', () => {
    const CF_1 = 'CUSTOM_FIELD_fd1a4b4d_2ca6_4be0_8c64_3beff02edeb2';
    const CF_2 = 'CUSTOM_FIELD_b1c66306_e203_45b4_b0ac_1846590486ae';

    it('should accept regular variables', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, 10);
        parser.setVariable(CF_2, 20);
        const formula = `SUM(${CF_1}, ${CF_2})`;

        const result = parser.parse(formula);

        expect(result).toEqual({ error: null, result: 30 });
    });

    it('should accept formula variables', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, createCustomFieldVariable(CF_1, 'SUM(10, 20, 30)', 'formula'));
        parser.setVariable(CF_2, createCustomFieldVariable(CF_2, 20, 'number'));
        const formula = `SUM(${CF_1}, ${CF_2})`;

        const result = parser.parse(formula);

        expect(result).toEqual({ error: null, result: 80 });
    });

    it('should return error if formula variable is invalid', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, createCustomFieldVariable(CF_1, '100/0', 'formula'));
        parser.setVariable(CF_2, createCustomFieldVariable(CF_2, 20, 'number'));

        const formula = `SUM(${CF_1}, ${CF_2})`;

        const result = parser.parse(formula);

        expect(result.error).toBe('#DIV/0!');
    });

    it('should return error if dependent formula is invalid', () => {
        const parser = ClickUpParser.create(10);
        parser.setVariable(CF_1, createCustomFieldVariable(CF_1, `SUM(${CF_2}, 20)`, 'formula'));
        parser.setVariable(CF_2, createCustomFieldVariable(CF_2, '100/0', 'formula'));

        const formula = `SUM(${CF_2}, 30)`;

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
        parser.setVariable(CF_1, createCustomFieldVariable(CF_1, `SUM(${CF_2}, 20)`, 'formula'));
        parser.setVariable(CF_2, createCustomFieldVariable(CF_2, `SUM(${CF_1}, 30)`, 'formula'));

        const formula = `SUM(${CF_1}, ${CF_2})`;

        const result = parser.parse(formula);

        // TODO: special error for circular dependency
        expect(result.error).toBe('#CYCLE!');
    });

    it('should return error if max levels exceeded', () => {
        const parser = ClickUpParser.create(1);
        parser.setVariable(CF_1, createCustomFieldVariable(CF_1, `SUM(${CF_2}, 20)`, 'formula'));
        parser.setVariable(CF_2, createCustomFieldVariable(CF_2, `SUM(20, 30)`, 'formula'));
        const formula = `SUM(${CF_1}, ${CF_2})`;
        const result = parser.parse(formula);

        expect(result.error).toBe('#LEVEL!');
    });

    it('should not return error if max levels reached', () => {
        const parser = ClickUpParser.create(2);
        parser.setVariable(CF_1, createCustomFieldVariable(CF_1, `SUM(${CF_2}, 20)`, 'formula'));
        parser.setVariable(CF_2, createCustomFieldVariable(CF_2, `SUM(20, 30)`, 'formula'));
        const formula = `SUM(${CF_1}, ${CF_2})`;
        const result = parser.parse(formula);

        expect(result.result).toBe(120);
    });

    it('should accept null as a value', () => {
        const parser = ClickUpParser.create();
        parser.setVariable(CF_1, null);
        const formula = `${CF_1} + 20`;

        const result = parser.parse(formula);

        expect(result).toEqual({ error: '#VALUE!', result: null });
    });
});
