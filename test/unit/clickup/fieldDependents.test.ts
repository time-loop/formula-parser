import fs from 'fs';
import path from 'path';

import { createDependencyDetector, haveSameDependencies } from '../../../src/clickup/fieldDependents';
import perfTestVariables from '../../data/test_custom_fields.json';

describe('field dependents graph', () => {
    const CF_1_ID = '100';
    const CF_2_ID = '200';
    const CF_3_ID = '300';
    const CF_4_ID = '400';
    const CF_5_ID = '500';

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
        const createName = (id: string) => `CUSTOM_FIELD_${id}`;
        const variables = [
            { id: CF_1_ID, type: 'number', value: 10 },
            { id: CF_2_ID, type: 'number', value: 20 },
            { id: CF_3_ID, type: 'formula', value: `${createName(CF_1_ID)} + ${createName(CF_2_ID)}` },
            { id: CF_4_ID, type: 'formula', value: `${createName(CF_2_ID)} + ${createName(CF_3_ID)}` },
            { id: CF_5_ID, type: 'formula', value: `${createName(CF_3_ID)} + ${createName(CF_4_ID)}` },
        ];
        const depsDetector = createDependencyDetector(variables);

        expect(depsDetector.getDependents(CF_1_ID)).toEqual([CF_3_ID]);
        expect(depsDetector.getDependents(CF_2_ID)).toEqual([CF_3_ID, CF_4_ID]);
        expect(depsDetector.getDependents(CF_3_ID)).toEqual([CF_4_ID, CF_5_ID]);
        expect(depsDetector.getDependents(CF_4_ID)).toEqual([CF_5_ID]);
        expect(depsDetector.getDependents(CF_5_ID)).toEqual([]);
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
        const createName = (id: string) => `CUSTOM_FIELD_${id}`;
        const variables = [
            { id: CF_1_ID, type: 'number', value: 10 },
            { id: CF_2_ID, type: 'number', value: 20 },
            { id: CF_3_ID, type: 'formula', value: `${createName(CF_1_ID)} + ${createName(CF_5_ID)}` },
            { id: CF_4_ID, type: 'formula', value: `${createName(CF_2_ID)} + ${createName(CF_3_ID)}` },
            { id: CF_5_ID, type: 'formula', value: `${createName(CF_3_ID)} + ${createName(CF_4_ID)}` },
        ];
        const depsDetector = createDependencyDetector(variables);

        expect(depsDetector.getDependents(CF_1_ID)).toEqual([CF_3_ID]);
        expect(depsDetector.getDependents(CF_2_ID)).toEqual([CF_4_ID]);
        expect(depsDetector.getDependents(CF_3_ID)).toEqual([CF_4_ID, CF_5_ID]);
        expect(depsDetector.getDependents(CF_4_ID)).toEqual([CF_5_ID]);
        expect(depsDetector.getDependents(CF_5_ID)).toEqual([CF_3_ID]);
        expect(depsDetector.hasCycle()).toBe(true);
    });

    it('should detect that two formulas have the same dependencies', () => {
        const cf1 = { id: '100', type: 'formula', value: 'CUSTOM_FIELD_1 + CUSTOM_FIELD_2' };
        const cf2 = { id: '200', type: 'formula', value: 'CUSTOM_FIELD_2 + CUSTOM_FIELD_1' };
        expect(haveSameDependencies(cf1, cf2)).toBe(true);
    });

    it('should detect that two formulas have different dependencies', () => {
        const cf1 = { id: '100', type: 'formula', value: 'CUSTOM_FIELD_1 + CUSTOM_FIELD_2' };
        const cf2 = { id: '200', type: 'formula', value: 'CUSTOM_FIELD_2 + CUSTOM_FIELD_3' };
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
            if (depsDetector.hasCycle()) {
                console.log('Cycle detected');
            }
        }
        const end = Date.now();
        const time = end - start;
        const timeAverage = time / iterations;
        console.log(`Time: ${time}ms`);
        console.log(`Mean time per iteration: ${timeAverage}ms`);
        expect(timeAverage).toBeLessThan(500);
    });
});
