export const hasNil = (...args: unknown[]) =>
    args.some((arg) => arg === null || arg === undefined || arg === '' || arg === false);

export const nilToZero = (arg: unknown) => (hasNil(arg) ? 0 : arg);
