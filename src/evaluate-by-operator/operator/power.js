import { toNumber } from '../../helper/number';
import { ERROR_VALUE } from '../../error';
import { hasNil } from '../../clickup/utils';

export const SYMBOL = '^';

export default function func(exp1, exp2) {
    if (hasNil(exp1, exp2)) {
        // some of the arguments are unset, return NaN
        return Number.NaN;
    }

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
