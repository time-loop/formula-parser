export const ERROR = 'ERROR';
export const ERROR_DIV_ZERO = 'DIV/0';
export const ERROR_NAME = 'NAME';
export const ERROR_NOT_AVAILABLE = 'N/A';
export const ERROR_NULL = 'NULL';
export const ERROR_NUM = 'NUM';
export const ERROR_REF = 'REF';
export const ERROR_VALUE = 'VALUE';
export const ERROR_CYCLE = 'CYCLE';
export const ERROR_LEVEL = 'LEVEL';

const errors = {
    [ERROR]: '#ERROR!',
    [ERROR_DIV_ZERO]: '#DIV/0!',
    [ERROR_NAME]: '#NAME?',
    [ERROR_NOT_AVAILABLE]: '#N/A',
    [ERROR_NULL]: '#NULL!',
    [ERROR_NUM]: '#NUM!',
    [ERROR_REF]: '#REF!',
    [ERROR_VALUE]: '#VALUE!',
    [ERROR_CYCLE]: '#CYCLE!',
    [ERROR_LEVEL]: '#LEVEL!',
};

/**
 * Return error type based on provided error id.
 *
 * @param {String} type Error type.
 * @returns {String|null} Returns error id.
 */
export default function error(type) {
    let result;

    type = String(type).replace(/#|!|\?/g, '');

    if (errors[type]) {
        result = errors[type];
    }

    return result ? result : null;
}

/**
 * Check if error type is strict valid with knows errors.
 *
 * @param {String} type Error type.
 * @return {Boolean}
 */
export function isValidStrict(type) {
    let valid = false;

    for (const i in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, i) && errors[i] === type) {
            valid = true;
            break;
        }
    }

    return valid;
}
