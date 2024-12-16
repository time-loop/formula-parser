import { toNumber } from '../../helper/number';
import ClickUpConfiguration from '../../clickup.config';
import { ERROR_VALUE } from '../../error';

export const SYMBOL = '-';

export default function func(first, ...rest) {
    const toNumberConfig = {
        convertDatesToNumbers: ClickUpConfiguration.ConvertDatesToNumbers,
        convertFormulasInNumbers: ClickUpConfiguration.ConvertFormulasInNumbers,
    };

    if ([first, ...rest].some((v) => v === false)) {
        return Number.NaN;
    }

    const result = rest.reduce((acc, value) => {
        const subtrahend = toNumber(value, toNumberConfig);
        if (Number.isNaN(subtrahend)) {
            return Number.NaN;
        }
        return acc - subtrahend;
    }, toNumber(first, toNumberConfig));

    if (Number.isNaN(result)) {
        throw Error(ERROR_VALUE);
    }

    return result;
}

func.SYMBOL = SYMBOL;
