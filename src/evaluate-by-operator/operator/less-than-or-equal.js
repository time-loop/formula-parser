import {canCompareArgs} from '../../helper/date';

export const SYMBOL = '<=';

export default function func(exp1, exp2) {
  if (!canCompareArgs(exp1, exp2)) {
    return false;
  }
  return exp1 <= exp2;
}

func.SYMBOL = SYMBOL;
