import { toNumber } from '../../helper/number';
import { ERROR_VALUE } from '../../error';

export const SYMBOL = '*';

export default function func(first, ...rest) {
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
