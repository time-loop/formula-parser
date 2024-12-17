import { formulajsProxy as formulajs } from '../clickup/formulajsProxy';
import splitFormula from './formula';
import { getNumberOfDaysSinceEpoch, isDate } from './date';

const AcceptedFormulaJSConversions = ['DATE('];

/**
 * Convert value into number.
 *
 * @param {String|Number} value
 * @param {Object} config
 * @returns {*}
 */
export function toNumber(
    value,
    config = {
        convertDatesToNumbers: false,
        convertFormulasInNumbers: false,
    }
) {
    if (value === null || value === undefined) {
        return 0;
    }

    if (typeof value === 'number') {
        return value;
    }

    if (typeof value === 'string') {
        const shouldBeParsed = AcceptedFormulaJSConversions.some((conversion) => value.startsWith(conversion));
        if (shouldBeParsed && Boolean(config.convertFormulasInNumbers)) {
            const { name, args } = splitFormula(value);
            const formulaResult = formulajs[name](...args);
            return toNumber(formulaResult, config);
        }

        return value.indexOf('.') > -1 ? parseFloat(value) : parseInt(value, 10);
    }

    if (isDate(value) && Boolean(config.convertDatesToNumbers)) {
        return getNumberOfDaysSinceEpoch(value);
    }

    return Number.NaN;
}

/**
 * Invert provided number.
 *
 * @param {Number} number
 * @returns {Number} Returns inverted number.
 */
export function invertNumber(number) {
    const toInvert = toNumber(number);
    if (toInvert === undefined) {
        return Number.NaN;
    }
    return -1 * toInvert;
}
