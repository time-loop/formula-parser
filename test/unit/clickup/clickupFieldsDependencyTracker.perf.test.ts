import fs from 'fs';
import path from 'path';
import { ClickUpFieldsDependencyTracker } from '../../../src';
import { ClickUpParserVariable } from '../../../src/clickup/clickupParserVariable';

describe('ClickupFieldsDependencyTracker', () => {
    describe('performance tests', () => {
        interface AugmentedTracker {
            getDependencyGraph(): unknown;
        }

        const filePath = path.join(process.cwd(), 'test', 'data', 'test_custom_fields.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const variables = JSON.parse(data);

        function getVariables(): ClickUpParserVariable[] {
            return [...variables];
        }

        function getRandomSample<T>(arr: T[], sampleSize: number): T[] {
            if (sampleSize > arr.length) {
                throw new Error('Sample size cannot be larger than the array size.');
            }

            // Create a copy of the array to avoid modifying the original array
            const arrayCopy = arr.slice();

            // Fisher-Yates shuffle, optimized to shuffle only up to sampleSize
            for (let i = 0; i < sampleSize; i++) {
                const j = Math.floor(Math.random() * (arr.length - i)) + i;
                [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
            }
            // Return the first N elements of the shuffled array
            return arrayCopy.slice(0, sampleSize);
        }
        it('graph creation should be fast enough', () => {
            const start = performance.now();
            const iterations = 10;
            for (let i = 0; i < iterations; i++) {
                const variables = getVariables();
                const tracker = new ClickUpFieldsDependencyTracker(variables) as unknown as AugmentedTracker;
                const graph = tracker.getDependencyGraph();
                expect(graph).toBeDefined();
            }
            const timeAverage = (performance.now() - start) / iterations;

            expect(timeAverage).toBeLessThan(250);
            console.log(`Graph creation for ${variables.length} variables (average time): ${timeAverage} ms`);
        });

        it('dependencies validation should be fast enough', () => {
            const variables = getVariables();
            const validator = new ClickUpFieldsDependencyTracker(variables);
            {
                // initialze the graph outside of the measurement
                const augmented = validator as unknown as AugmentedTracker;
                augmented.getDependencyGraph();
            }

            const start = performance.now();
            const iterations = 100;
            for (let i = 0; i < iterations; i++) {
                validator.validate();
            }
            const time = (performance.now() - start) / iterations;

            expect(time).toBeLessThan(250);
            console.log(`Dependencies validation for ${variables.length} variables (average time): ${time} ms`);
        });

        it('fetching dependants should be fast enough', () => {
            const variables = getVariables();
            const tracker = new ClickUpFieldsDependencyTracker(variables);
            {
                // initialze the graph outside of the measurement
                const augmented = tracker as unknown as AugmentedTracker;
                augmented.getDependencyGraph();
            }

            const varsSample = getRandomSample(variables, 1000);
            const start = performance.now();
            for (const variable of varsSample) {
                tracker.getDependentFields(variable.name);
            }
            const time = (performance.now() - start) / variables.length;

            expect(time).toBeLessThan(250);
            console.log(`Fetching dependants for ${variables.length} variables (average time): ${time} ms`);
        });
    });
});
