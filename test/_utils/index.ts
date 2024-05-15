import { matchers } from './matchers';

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeMatchCloseTo(expected: any, precision?: number): R;
        }
    }
}

expect.extend(matchers);

export default undefined;
