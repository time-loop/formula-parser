// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Parser } from '@time-loop/hot-formula-parser';

// types and constants definitions
type FieldId = string;
type FieldType = 'date' | 'number' | 'string' | 'boolean' | 'formula';
type FieldValue = Date | number | string | boolean;
type FieldDefinition = {
    type: FieldType;
    value: FieldValue;
};
const FIELD_VALUE_GET = 'CU_FIELD';

// simulate custom fields
const customFields: Record<FieldId, FieldDefinition> = {
    TASK_START_DATE: { type: 'date', value: new Date(2024, 3, 20).toISOString() },
    TASK_END_DATE: { type: 'date', value: new Date(2024, 3, 22).toISOString() },
    TASK_DURATION_ESTIMATION: { type: 'formula', value: 'DAYS(TASK_END_DATE, TASK_START_DATE)' },
    TASK_DURATION_ACTUAL: { type: 'formula', value: `${FIELD_VALUE_GET}("TASK_DURATION_ESTIMATION") * 2` },
    TASK_DURATION_ASSUMED: { type: 'formula', value: `${FIELD_VALUE_GET}("TASK_DURATION_ACTUAL") * 3` },
    CIRCULAR_1: { type: 'formula', value: `${FIELD_VALUE_GET}("CIRCULAR_2")` },
    CIRCULAR_2: { type: 'formula', value: `${FIELD_VALUE_GET}("CIRCULAR_3")` },
    CIRCULAR_3: { type: 'formula', value: `${FIELD_VALUE_GET}("CIRCULAR_1")` },
};

// function retrieving custom field value
// function retrieving custom field value
const customFieldValueGet =
    (parser: Parser) =>
    (fieldId: FieldId): FieldValue => {
        const fieldDefinition = customFields[fieldId];
        if (!fieldDefinition) {
            throw new Error(`Field ${fieldId} not found`);
        }
        if (fieldDefinition.type === 'formula') {
            const { error, result } = parser.parse(fieldDefinition.value);
            if (error) {
                throw new Error(`Error parsing formula ${fieldDefinition.value}: ${error}`);
            }
            return result;
        }
        return fieldDefinition.value;
    };

// circular dependency detection - start

// evaluation context to detect circular dependencies
type EvaluationContext = {
    evaluating: Set<FieldId>;
    callsCount: number;
    maxCallsCount: number;
};

const createContext = (maxCallsCount: number): EvaluationContext => ({
    evaluating: new Set<FieldId>(),
    callsCount: 0,
    maxCallsCount,
});

// function wrapping the custom field value getter to detect circular dependencies
const withEvaluationContext =
    (context: EvaluationContext, evaluate: (fieldId: FieldId) => FieldValue) => (params: string[]) => {
        const fieldId = params[0] as FieldId;
        if (context.evaluating.has(fieldId)) {
            const errorMessage = `Circular dependency detected: ${Array.from(context.evaluating).join(
                ' -> '
            )} -> ${fieldId}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        context.evaluating.add(fieldId);
        context.callsCount++;
        if (context.callsCount > context.maxCallsCount) {
            const message = `Max formulas depth exceeded: ${context.callsCount}`;
            console.error(message);
            throw new Error(message);
        }
        const value = evaluate(fieldId);
        context.evaluating.delete(fieldId);
        return value;
    };

// function preparing the parser with custom fields and circular dependency detection
function getParser(customFields: Record<FieldId, FieldDefinition>) {
    // initialize the parser
    const parser = new Parser();
    parser.setVariable('true', true).setVariable('false', false).setVariable('null', null);
    // set custom fields as variables except for formula fields
    Object.entries(customFields).forEach(([fieldId, fieldDefinition]) => {
        if (fieldDefinition.type !== 'formula') {
            parser.setVariable(fieldId, fieldDefinition.value);
        }
    });
    // create evaluation context for
    // 1. circular dependency detection
    // 2. max formulas depth detection
    const evaluationContext = createContext(10);
    // set custom field getter function
    parser.setFunction(FIELD_VALUE_GET, withEvaluationContext(evaluationContext, customFieldValueGet(parser)));

    return parser;
}

Object.entries(customFields)
    .filter(([_, definition]) => definition.type === 'formula')
    .map(([fieldId, definition]) => [fieldId, definition.value])
    .forEach(([name, formula]) => {
        console.log(`========================================`);
        console.log(`${name}: ${formula}`);
        const parser = getParser(customFields);
        const { error, result } = parser.parse(formula);
        console.log('RESULT: ', { name, error, result });
    });
