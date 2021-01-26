import {dateToNumber} from '../../helper/date';

export const SYMBOL = '<>';

export default function func(exp1, exp2) {
  return dateToNumber(exp1) !== dateToNumber(exp2);
}

func.SYMBOL = SYMBOL;
