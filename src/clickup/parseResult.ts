// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Result = any;

export interface ParseResult {
    result: Result | null;
    error: string | null;
}
