import { toNumber } from '../../helper/number';
import { ERROR_VALUE } from '../../error';
import { hasNil } from '../../clickup/utils';

export const SYMBOL = '*';

export default function func(first, ...rest) {
    if (hasNil(first, ...rest)) {
        // some of the arguments are unset, return NaN
        return Number.NaN;
    }

    const result = rest.reduce((acc, value) => {
        const num = toNumber(value);
        if (num === undefined) {
            throw Error(ERROR_VALUE);
        }
        return acc * num;
    }, toNumber(first));

    if (isNaN(result)) {
        throw Error(ERROR_VALUE);
    }

    return result;
}

func.SYMBOL = SYMBOL;
