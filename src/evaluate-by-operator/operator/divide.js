import { toNumber } from '../../helper/number';
import { ERROR_DIV_ZERO, ERROR_VALUE } from '../../error';
import { hasNil } from '../../clickup/utils';

export const SYMBOL = '/';

export default function func(first, ...rest) {
    if (hasNil(first, ...rest)) {
        // some of the arguments are unset, return NaN
        return Number.NaN;
    }

    const result = rest.reduce((acc, value) => acc / Number(toNumber(value)), Number(toNumber(first)));

    if (result === Infinity) {
        throw Error(ERROR_DIV_ZERO);
    }
    if (isNaN(result)) {
        throw Error(ERROR_VALUE);
    }

    return result;
}

func.SYMBOL = SYMBOL;
