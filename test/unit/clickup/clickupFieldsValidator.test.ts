import fs from 'fs';
import path from 'path';
import { createCustomFieldVariable } from '../../../src/clickup/customField';
import { ClickUpFieldsValidator } from '../../../src/clickup/clickupFieldsValidator';

describe('clickupFieldsValidator', () => {
    const createName = (id: string) => `CUSTOM_FIELD_${id}`;
    const CF_1_NAME = createName('100');
    const CF_2_NAME = createName('200');
    const CF_3_NAME = createName('300');
    const CF_4_NAME = createName('400');
    const CF_5_NAME = createName('500');

    it('should return dependants in order', () => {
        const variables = [
            createCustomFieldVariable(CF_1_NAME, 'number', '10'),
            createCustomFieldVariable(CF_2_NAME, 20, 'number'),
            createCustomFieldVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_2_NAME}`, 'formula'),
            createCustomFieldVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, 'formula'),
            createCustomFieldVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, 'formula'),
        ];

        const validator = new ClickUpFieldsValidator(variables);
        expect(validator.getDependentFields(CF_1_NAME)).toEqual([CF_3_NAME, CF_4_NAME, CF_5_NAME]);
        expect(validator.getDependentFields(CF_2_NAME)).toEqual([CF_3_NAME, CF_4_NAME, CF_5_NAME]);
        expect(validator.getDependentFields(CF_3_NAME)).toEqual([CF_4_NAME, CF_5_NAME]);
        expect(validator.getDependentFields(CF_4_NAME)).toEqual([CF_5_NAME]);
        expect(validator.getDependentFields(CF_5_NAME)).toEqual([]);
        expect(() => validator.validate()).not.toThrow();
    });

    it('should detect cycle', () => {
        const variables = [
            createCustomFieldVariable(CF_1_NAME, 10, 'number'),
            createCustomFieldVariable(CF_2_NAME, 20, 'number'),
            createCustomFieldVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_5_NAME}`, 'formula'),
            createCustomFieldVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, 'formula'),
            createCustomFieldVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, 'formula'),
        ];
        const validator = new ClickUpFieldsValidator(variables);

        expect(() => validator.validate()).toThrow('Circular dependency detected');
    });

    it('should detect nesting is too deep', () => {
        const variables = [
            createCustomFieldVariable(CF_1_NAME, 10, 'number'),
            createCustomFieldVariable(CF_2_NAME, 20, 'number'),
            createCustomFieldVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_2_NAME}`, 'formula'),
            createCustomFieldVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, 'formula'),
            createCustomFieldVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, 'formula'),
        ];
        const validator = new ClickUpFieldsValidator(variables, 2);

        expect(() => validator.validate()).toThrow('Nesting is too deep');
    });

    it('construction should be fast enough', () => {
        const filePath = path.join(process.cwd(), 'test', 'data', 'test_custom_fields.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const variables = JSON.parse(data);
        const start = performance.now();
        const iterations = 100;
        for (let i = 0; i < iterations; i++) {
            new ClickUpFieldsValidator(variables);
        }
        const timeAverage = (performance.now() - start) / iterations;
        expect(timeAverage).toBeLessThan(250);
        console.log(`Validator construction for ${variables.length} variables (average time): ${timeAverage} ms`);
    });

    it('validation should be fast enough', () => {
        const filePath = path.join(process.cwd(), 'test', 'data', 'test_custom_fields.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const variables = JSON.parse(data);
        const validator = new ClickUpFieldsValidator(variables);
        const start = performance.now();
        const iterations = 10;
        for (let i = 0; i < iterations; i++) {
            validator.validate();
        }
        const timeAverage = (performance.now() - start) / iterations;
        expect(timeAverage).toBeLessThan(250);
        console.log(`Dependencies validation for ${variables.length} variables (average time): ${timeAverage} ms`);
    });
});
