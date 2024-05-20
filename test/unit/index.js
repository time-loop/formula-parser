import {
    Parser,
    ClickUpParser,
    SUPPORTED_FORMULAS,
    ERROR,
    ERROR_DIV_ZERO,
    ERROR_NAME,
    ERROR_NOT_AVAILABLE,
    ERROR_NULL,
    ERROR_NUM,
    ERROR_REF,
    ERROR_VALUE,
    ERROR_CYCLE,
    ERROR_LEVEL,
    error,
    extractLabel,
    toLabel,
    columnIndexToLabel,
    columnLabelToIndex,
    rowIndexToLabel,
    rowLabelToIndex,
} from '../../src/index';

describe('Public API', () => {
    it('Parser should be defined', () => {
        expect(Parser).toBeInstanceOf(Function);
    });

    it('ClickUpParser should be defined', () => {
        expect(ClickUpParser).toBeInstanceOf(Function);
    });

    it('SUPPORTED_FORMULAS should be defined', () => {
        expect(SUPPORTED_FORMULAS).toBeInstanceOf(Array);
    });

    it('ERROR should be defined', () => {
        expect(ERROR).toBeDefined();
    });

    it('ERROR_DIV_ZERO should be defined', () => {
        expect(ERROR_DIV_ZERO).toBeDefined();
    });

    it('ERROR_NAME should be defined', () => {
        expect(ERROR_NAME).toBeDefined();
    });

    it('ERROR_NOT_AVAILABLE should be defined', () => {
        expect(ERROR_NOT_AVAILABLE).toBeDefined();
    });

    it('ERROR_NULL should be defined', () => {
        expect(ERROR_NULL).toBeDefined();
    });

    it('ERROR_NUM should be defined', () => {
        expect(ERROR_NUM).toBeDefined();
    });

    it('ERROR_REF should be defined', () => {
        expect(ERROR_REF).toBeDefined();
    });

    it('ERROR_VALUE should be defined', () => {
        expect(ERROR_VALUE).toBeDefined();
    });

    it('ERROR_CYCLE should be defined', () => {
        expect(ERROR_CYCLE).toBeDefined();
    });

    it('ERROR_LEVEL should be defined', () => {
        expect(ERROR_LEVEL).toBeDefined();
    });

    it('error should be defined', () => {
        expect(error).toBeDefined();
    });

    it('extractLabel should be defined', () => {
        expect(extractLabel).toBeDefined();
    });

    it('toLabel should be defined', () => {
        expect(toLabel).toBeDefined();
    });

    it('columnIndexToLabel should be defined', () => {
        expect(columnIndexToLabel).toBeDefined();
    });

    it('columnLabelToIndex should be defined', () => {
        expect(columnLabelToIndex).toBeDefined();
    });

    it('rowIndexToLabel should be defined', () => {
        expect(rowIndexToLabel).toBeDefined();
    });

    it('rowLabelToIndex should be defined', () => {
        expect(rowLabelToIndex).toBeDefined();
    });
});
