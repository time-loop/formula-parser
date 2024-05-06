import * as formulajs from '@formulajs/formulajs';
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
    if (value === null || value === undefined || value === '') {
        return undefined;
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

    return undefined;
}

/**
 * Invert provided number.
 *
 * @param {Number} number
 * @returns {Number} Returns inverted number.
 */
export function invertNumber(number) {
    return -1 * toNumber(number);
}
