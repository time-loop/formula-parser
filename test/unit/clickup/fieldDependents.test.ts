import fs from 'fs';
import path from 'path';

import { createDependencyDetector, haveSameDependencies } from '../../../src/clickup/fieldDependents';
import { createCustomFieldVariable } from '../../../src/clickup/customField';

describe('field dependents graph', () => {
    const createName = (id: string) => `CUSTOM_FIELD_${id}`;
    const CF_1_NAME = createName('100');
    const CF_2_NAME = createName('200');
    const CF_3_NAME = createName('300');
    const CF_4_NAME = createName('400');
    const CF_5_NAME = createName('500');

    it('should create a reverse dependency graph', () => {
        /**
         * CF_5
         *   -> CF_3
         *     -> CF_1
         *     -> CF_2
         *   -> CF_4
         *     -> CF_2
         *     -> CF_3*
         */
        const variables = [
            createCustomFieldVariable(CF_1_NAME, 'number', '10'),
            createCustomFieldVariable(CF_2_NAME, 20, 'number'),
            createCustomFieldVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_2_NAME}`, 'formula'),
            createCustomFieldVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, 'formula'),
            createCustomFieldVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, 'formula'),
        ];
        const depsDetector = createDependencyDetector(variables);

        expect(depsDetector.getDependents(CF_1_NAME)).toEqual([CF_3_NAME]);
        expect(depsDetector.getDependents(CF_2_NAME)).toEqual([CF_3_NAME, CF_4_NAME]);
        expect(depsDetector.getDependents(CF_3_NAME)).toEqual([CF_4_NAME, CF_5_NAME]);
        expect(depsDetector.getDependents(CF_4_NAME)).toEqual([CF_5_NAME]);
        expect(depsDetector.getDependents(CF_5_NAME)).toEqual([]);
        expect(depsDetector.hasCycle()).toBe(false);
    });

    it('should detect circular dependencies', () => {
        /**
         * CF_5
         *   -> CF_3
         *     -> CF_1
         *     -> CF_2
         *   -> CF_4
         *     -> CF_2
         *     -> CF_3*
         */
        const variables = [
            createCustomFieldVariable(CF_1_NAME, 10, 'number'),
            createCustomFieldVariable(CF_2_NAME, 20, 'number'),
            createCustomFieldVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_5_NAME}`, 'formula'),
            createCustomFieldVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, 'formula'),
            createCustomFieldVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, 'formula'),
        ];
        const depsDetector = createDependencyDetector(variables);

        expect(depsDetector.getDependents(CF_1_NAME)).toEqual([CF_3_NAME]);
        expect(depsDetector.getDependents(CF_2_NAME)).toEqual([CF_4_NAME]);
        expect(depsDetector.getDependents(CF_3_NAME)).toEqual([CF_4_NAME, CF_5_NAME]);
        expect(depsDetector.getDependents(CF_4_NAME)).toEqual([CF_5_NAME]);
        expect(depsDetector.getDependents(CF_5_NAME)).toEqual([CF_3_NAME]);
        expect(depsDetector.hasCycle()).toBe(true);
    });

    it('should detect that two formulas have the same dependencies', () => {
        const cf1 = createCustomFieldVariable(CF_1_NAME, 'CUSTOM_FIELD_1 + CUSTOM_FIELD_2', 'formula');
        const cf2 = createCustomFieldVariable(CF_2_NAME, 'CUSTOM_FIELD_2 + CUSTOM_FIELD_1', 'formula');
        expect(haveSameDependencies(cf1, cf2)).toBe(true);
    });

    it('should detect that two formulas have different dependencies', () => {
        const cf1 = createCustomFieldVariable(CF_1_NAME, 'CUSTOM_FIELD_1 + CUSTOM_FIELD_2', 'formula');
        const cf2 = createCustomFieldVariable(CF_2_NAME, 'CUSTOM_FIELD_2 + CUSTOM_FIELD_3', 'formula');
        expect(haveSameDependencies(cf1, cf2)).toBe(false);
    });

    it('should be fast enough', async () => {
        const filePath = path.join(process.cwd(), 'test', 'data', 'test_custom_fields.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const variables = JSON.parse(data);
        const start = Date.now();
        const iterations = 10;
        for (let i = 0; i < iterations; i++) {
            const depsDetector = createDependencyDetector(variables);
            const hasCycle = depsDetector.hasCycle();
            // test data don't have cycles
            expect(hasCycle).toBe(false);
        }
        const timeAverage = (Date.now() - start) / iterations;
        expect(timeAverage).toBeLessThan(250);
        console.log(`Dependencies detection for ${variables.length} variables (average time): ${timeAverage} ms`);
    });
});
