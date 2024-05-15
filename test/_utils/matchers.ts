const isObject = (obj: any) => obj !== null && typeof obj === 'object';

export const matchers = {
    toBeMatchCloseTo(received: any, expected: any, precision: number = 7): jest.CustomMatcherResult {
        if (!isObject(received) || !isObject(expected)) {
            return {
                pass: false,
                message: () => `expected ${received} and ${expected} to be objects`,
            };
        }

        const delta = 0.5 * Math.pow(10, -precision);
        // we're considering equal if are actually equal or are both NaN
        const areEqual = (a: unknown, b: unknown): boolean => a === b || isNaN(Number(a)) === isNaN(Number(b));
        const isNumber = (value: unknown): value is number => typeof value === 'number';
        const diff = (a: number, b: number): number => Math.abs(a - b);
        const createDeltaTest =
            (delta: number) =>
            (actual: number, wanted: number): boolean =>
                diff(actual, wanted) < delta;
        const isWithinDelta = createDeltaTest(delta);

        const pass = Object.keys(received).reduce((result, key) => {
            const [actual, wanted] = [received[key], expected[key]];
            const passing =
                areEqual(actual, wanted) || (isNumber(actual) && isNumber(wanted) && isWithinDelta(actual, wanted));

            return result && passing;
        }, true);

        return {
            pass,
            message: () =>
                `expected\n\n${JSON.stringify(received, null, 2)}\n\nto be close to\n\n${JSON.stringify(
                    expected,
                    null,
                    2
                )}\n\nwith precision ${precision}`,
        };
    },
};
