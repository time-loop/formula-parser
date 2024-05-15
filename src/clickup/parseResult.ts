export class ParseResult {
    readonly error: string | null;
    readonly result: any;

    constructor(error: string | null, result: any) {
        this.error = error;
        this.result = result;
    }
}
