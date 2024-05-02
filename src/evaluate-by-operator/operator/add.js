import { ADD } from '@formulajs/formulajs';
import { ERROR_VALUE } from './../../error';

export const SYMBOL = '+';

export default function func(first, ...rest) {
    const result = rest.reduce((acc, value) => ADD(acc, value), first);

    if (isNaN(result)) {
        throw Error(ERROR_VALUE);
    }

    return result;
}

func.SYMBOL = SYMBOL;
