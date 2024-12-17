import { toNumber } from '../../helper/number';
import { ERROR_VALUE } from '../../error';
import { nilToZero } from '../../clickup/utils';

export const SYMBOL = '+';

export default function func(first, ...rest) {
    // in addition, we convert unset values to zero
    const result = rest.reduce((acc, value) => acc + toNumber(nilToZero(value)), toNumber(nilToZero(first)));

    if (isNaN(result)) {
        throw Error(ERROR_VALUE);
    }

    return result;
}

func.SYMBOL = SYMBOL;
