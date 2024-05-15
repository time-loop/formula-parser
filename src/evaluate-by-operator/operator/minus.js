import { toNumber } from '../../helper/number';
import { ERROR_VALUE } from '../../error';
import ClickUpConfiguration from '../../clickup.config';

export const SYMBOL = '-';

export default function func(first, ...rest) {
    const toNumberConfig = {
        convertDatesToNumbers: ClickUpConfiguration.ConvertDatesToNumbers,
        convertFormulasInNumbers: ClickUpConfiguration.ConvertFormulasInNumbers,
    };

    const result = rest.reduce((acc, value) => {
        const subtrahend = toNumber(value, toNumberConfig);
        return acc - (subtrahend || 0);
    }, toNumber(first, toNumberConfig));

    if (isNaN(result)) {
        throw Error(ERROR_VALUE);
    }

    return result;
}

func.SYMBOL = SYMBOL;
