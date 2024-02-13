import * as formulajs from '@formulajs/formulajs';
import splitFormula from './formula';
import {getNumberOfDaysSinceEpoch, isDate} from './date';

import ClickUpConfiguration from '../clickup.config';

const AcceptedFormulaJSConversions = ['DATE('];

/**
 * Convert value into number.
 *
 * @param {String|Number} value
 * @returns {*}
 */
export function toNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const shouldBeParsed = AcceptedFormulaJSConversions.some((conversion) => value.startsWith(conversion));
    if (shouldBeParsed && ClickUpConfiguration.UseNumericOverrides) {
      const {name, args} = splitFormula(value);
      return toNumber(formulajs[name](...args));
    }

    return value.indexOf('.') > -1 ? parseFloat(value) : parseInt(value, 10);
  }

  if (isDate(value) && ClickUpConfiguration.UseNumericOverrides) {
    return getNumberOfDaysSinceEpoch(value);
  }

  return NaN;
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
