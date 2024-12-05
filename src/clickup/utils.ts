import { toNumber } from '../helper/number';

export const hasNil = (...args: unknown[]) =>
    args.some((arg) => arg === null || arg === undefined || arg === '' || arg === false);

export const allNil = (...args: unknown[]) =>
    args.every((arg) => arg === null || arg === undefined || arg === '' || arg === false);

export const allNumber = (...args: unknown[]) => !args.map(toNumber).some(Number.isNaN);

export const nullToZero = (arg: unknown) => (hasNil(arg) ? 0 : arg);
