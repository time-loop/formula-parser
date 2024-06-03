import fs from 'fs';
import path from 'path';
import { ClickUpFieldsDependencyTracker } from '../../../src/clickup/clickupFieldsDependencyTracker';
import { ClickUpParserVariable, createClickUpParserVariable } from '../../../src/clickup/clickupParserVariable';

describe('clickupFieldsValidator', () => {
    const createName = (id: string) => `CUSTOM_FIELD_${id}`;
    const CF_1_NAME = createName('100');
    const CF_2_NAME = createName('200');
    const CF_3_NAME = createName('300');
    const CF_4_NAME = createName('400');
    const CF_5_NAME = createName('500');

    it('should return dependants in order', () => {
        const variables = [
            createClickUpParserVariable(CF_1_NAME, 'number', '10'),
            createClickUpParserVariable(CF_2_NAME, 20, 'number'),
            createClickUpParserVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_2_NAME}`, 'formula'),
            createClickUpParserVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, 'formula'),
            createClickUpParserVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, 'formula'),
        ];

        const validator = new ClickUpFieldsDependencyTracker(variables);
        expect(validator.getDependentFields(CF_1_NAME)).toEqual([CF_3_NAME, CF_4_NAME, CF_5_NAME]);
        expect(validator.getDependentFields(CF_2_NAME)).toEqual([CF_3_NAME, CF_4_NAME, CF_5_NAME]);
        expect(validator.getDependentFields(CF_3_NAME)).toEqual([CF_4_NAME, CF_5_NAME]);
        expect(validator.getDependentFields(CF_4_NAME)).toEqual([CF_5_NAME]);
        expect(validator.getDependentFields(CF_5_NAME)).toEqual([]);
        expect(() => validator.validate()).not.toThrow();
    });

    it('should detect cycle', () => {
        const variables = [
            createClickUpParserVariable(CF_1_NAME, 10, 'number'),
            createClickUpParserVariable(CF_2_NAME, 20, 'number'),
            createClickUpParserVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_5_NAME}`, 'formula'),
            createClickUpParserVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, 'formula'),
            createClickUpParserVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, 'formula'),
        ];
        const validator = new ClickUpFieldsDependencyTracker(variables);

        expect(() => validator.validate()).toThrow('Circular dependency detected');
    });

    it('should detect nesting is too deep', () => {
        const variables = [
            createClickUpParserVariable(CF_1_NAME, 10, 'number'),
            createClickUpParserVariable(CF_2_NAME, 20, 'number'),
            createClickUpParserVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_2_NAME}`, 'formula'),
            createClickUpParserVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, 'formula'),
            createClickUpParserVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, 'formula'),
        ];
        const validator = new ClickUpFieldsDependencyTracker(variables, 2);

        expect(() => validator.validate()).toThrow('Nesting is too deep');
    });

    describe('performance tests', () => {
        const filePath = path.join(process.cwd(), 'test', 'data', 'test_custom_fields.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const variables = JSON.parse(data);

        function getVariables(): ClickUpParserVariable[] {
            return [...variables];
        }

        it('graph creation should be fast enough', () => {
            interface AugmentedTracker {
                getDependencyGraph(): unknown;
            }

            const start = performance.now();
            const iterations = 100;
            for (let i = 0; i < iterations; i++) {
                const variables = getVariables();
                const tracker = new ClickUpFieldsDependencyTracker(variables) as unknown as AugmentedTracker;
                const graph = tracker.getDependencyGraph();
                expect(graph).toBeDefined();
            }
            const timeAverage = (performance.now() - start) / iterations;

            expect(timeAverage).toBeLessThan(250);
            console.log(
                `Graph creation for ${variables.length} variables (average time in ${iterations} iterations): ${timeAverage} ms`
            );
        });

        it('dependencies validation should be fast enough', () => {
            const variables = getVariables();
            const validator = new ClickUpFieldsDependencyTracker(variables);

            const start = performance.now();
            const iterations = 1000;
            for (let i = 0; i < iterations; i++) {
                validator.validate();
            }
            const time = performance.now() - start;

            expect(time).toBeLessThan(250);
            console.log(
                `Dependencies validation for ${variables.length} variables (${iterations} iterations): ${time} ms`
            );
        });

        it('fetching dependants should be fast enough', () => {
            const variables = getVariables();
            const validator = new ClickUpFieldsDependencyTracker(variables);

            const start = performance.now();
            for (const variable of variables) {
                validator.getDependentFields(variable.name);
            }
            const time = performance.now() - start;

            expect(time).toBeLessThan(250);
            console.log(`Fetching dependants for ${variables.length} variables (each variable): ${time} ms`);
        });
    });
});
