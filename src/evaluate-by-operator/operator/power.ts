import { toNumber } from '../../helper/number';
import { ERROR_VALUE } from '../../error';

export const SYMBOL = '^';

export default function func(exp1, exp2) {
    const exp1Number = toNumber(exp1);
    const exp2Number = toNumber(exp2);
    if (exp1Number === undefined || exp2Number === undefined) {
        throw Error(ERROR_VALUE);
    }
    const result = Math.pow(exp1Number, exp2Number);

    if (isNaN(result)) {
        throw Error(ERROR_VALUE);
    }

    return result;
}

func.SYMBOL = SYMBOL;
