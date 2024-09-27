import { ClickUpFieldsDependencyTracker } from '../../../src/clickup/clickupFieldsDependencyTracker';
import { createClickUpParserVariable } from '../../../src/clickup/clickupParserVariable';

describe('clickupFieldsValidator', () => {
    const createName = (id: string) => `CUSTOM_FIELD_${id}`;
    const CF_1_NAME = createName('100');
    const CF_2_NAME = createName('200');
    const CF_3_NAME = createName('300');
    const CF_4_NAME = createName('400');
    const CF_5_NAME = createName('500');

    it('should return dependants in order', () => {
        const variables = [
            createClickUpParserVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_2_NAME}`, true),
            createClickUpParserVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, true),
            createClickUpParserVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, true),
        ];

        const validator = new ClickUpFieldsDependencyTracker(variables);
        expect(validator.getDependentFields(CF_1_NAME)).toEqual([CF_3_NAME, CF_4_NAME, CF_5_NAME]);
        expect(validator.getDependentFields(CF_2_NAME)).toEqual([CF_3_NAME, CF_4_NAME, CF_5_NAME]);
        expect(validator.getDependentFields(CF_3_NAME)).toEqual([CF_4_NAME, CF_5_NAME]);
        expect(validator.getDependentFields(CF_4_NAME)).toEqual([CF_5_NAME]);
        expect(validator.getDependentFields(CF_5_NAME)).toEqual([]);

        expect(validator.getFieldDependencies(CF_1_NAME)).toEqual([]);
        expect(validator.getFieldDependencies(CF_2_NAME)).toEqual([]);
        expect(validator.getFieldDependencies(CF_3_NAME)).toEqual([CF_1_NAME, CF_2_NAME]);
        expect(validator.getFieldDependencies(CF_4_NAME)).toEqual([CF_2_NAME, CF_1_NAME, CF_3_NAME]);
        expect(validator.getFieldDependencies(CF_5_NAME)).toEqual([CF_1_NAME, CF_2_NAME, CF_3_NAME, CF_4_NAME]);

        const result = validator.validate();
        expect(result).toEqual({
            hasCycle: false,
            circularDependencies: [],
            nestingByNode: expect.objectContaining({
                [CF_1_NAME]: 0,
                [CF_2_NAME]: 0,
                [CF_3_NAME]: 0,
                [CF_4_NAME]: 1,
                [CF_5_NAME]: 2,
            }),
        });
    });

    it('should detect cycle', () => {
        const variables = [
            createClickUpParserVariable(CF_3_NAME, `${CF_1_NAME} + ${CF_5_NAME}`, true),
            createClickUpParserVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, true),
            createClickUpParserVariable(CF_5_NAME, `${CF_3_NAME} + ${CF_4_NAME}`, true),
        ];
        const validator = new ClickUpFieldsDependencyTracker(variables);

        const result = validator.validate();
        expect(result).toEqual({
            hasCycle: true,
            circularDependencies: expect.arrayContaining([CF_3_NAME, CF_4_NAME, CF_5_NAME]),
            nestingByNode: expect.objectContaining({
                [CF_1_NAME]: 0,
                [CF_2_NAME]: 0,
                [CF_3_NAME]: 3,
                [CF_4_NAME]: 1,
                [CF_5_NAME]: 2,
            }),
        });
    });

    it('should detect nesting correctly', () => {
        const variables = [
            createClickUpParserVariable(CF_2_NAME, `${CF_1_NAME} * ${CF_1_NAME}`, true),
            createClickUpParserVariable(CF_3_NAME, `${CF_2_NAME} * ${CF_2_NAME}`, true),
            createClickUpParserVariable(CF_4_NAME, `${CF_2_NAME} + ${CF_3_NAME}`, true),
        ];
        const validator = new ClickUpFieldsDependencyTracker(variables);

        const result = validator.validate();

        expect(result).toEqual({
            hasCycle: false,
            circularDependencies: [],
            nestingByNode: expect.objectContaining({
                [CF_2_NAME]: 0,
                [CF_3_NAME]: 1,
                [CF_4_NAME]: 2,
            }),
        });
    });
});
