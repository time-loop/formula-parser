import * as formulajs from '@formulajs/formulajs';

const isNil = (...args: unknown[]) =>
    args.some((arg) => arg === null || arg === undefined || arg === '' || arg === false);
const nullToZero = (arg: unknown) => (isNil(arg) ? 0 : arg);

const overrides = {
    DATE: (year: unknown, month: unknown, day: unknown) =>
        isNil(year, month, day) ? null : formulajs.DATE(year, month, day),
    DATEVALUE: (dateText: unknown) => (isNil(dateText) ? null : formulajs.DATEVALUE(dateText)),
    DAY: (date: unknown) => (isNil(date) ? null : formulajs.DAY(date)),
    DAYS: (startDate: unknown, endDate: unknown) =>
        isNil(startDate, endDate) ? null : formulajs.DAYS(startDate, endDate),
    DAYS360: (startDate: unknown, endDate: unknown, method: unknown) =>
        isNil(startDate, endDate) ? null : formulajs.DAYS360(startDate, endDate, method),
    EDATE: (startDate: unknown, months: unknown) =>
        isNil(startDate) ? null : formulajs.EDATE(startDate, nullToZero(months)),
    EOMONTH: (startDate: unknown, months: unknown) =>
        isNil(startDate) ? null : formulajs.EOMONTH(startDate, nullToZero(months)),
    HOUR: (date: unknown) => (isNil(date) ? null : formulajs.HOUR(date)),
    INTERVAL: (seconds: unknown) => formulajs.INTERVAL(nullToZero(seconds)),
    ISOWEEKNUM: (date: unknown) => (isNil(date) ? null : formulajs.ISOWEEKNUM(date)),
    MINUTE: (serialNumber: unknown) => (isNil(serialNumber) ? null : formulajs.MINUTE(serialNumber)),
    MONTH: (date: unknown) => (isNil(date) ? null : formulajs.MONTH(date)),
    SECOND: (serialNumber: unknown) => (isNil(serialNumber) ? null : formulajs.SECOND(serialNumber)),
    TIME: (hour: unknown, minute: unknown, second: unknown) =>
        isNil(hour, minute, second) ? null : formulajs.TIME(hour, minute, second),
    TIMEVALUE: (timeText: unknown) => (isNil(timeText) ? null : formulajs.TIMEVALUE(timeText)),
    WEEKDAY: (serialNumber: unknown, returnType: unknown) =>
        isNil(serialNumber) ? null : formulajs.WEEKDAY(serialNumber, returnType),
    WEEKNUM: (serialNumber: unknown, returnType: unknown) =>
        isNil(serialNumber) ? null : formulajs.WEEKNUM(serialNumber, returnType),
    YEAR: (date: unknown) => (isNil(date) ? null : formulajs.YEAR(date)),
    YEARFRAC: (startDate: unknown, endDate: unknown, basis: unknown) =>
        isNil(startDate, endDate) ? null : formulajs.YEARFRAC(startDate, endDate, basis),
    WORKDAY: (startDate: unknown, days: unknown, holidays: unknown) =>
        isNil(startDate) ? null : formulajs.WORKDAY(startDate, nullToZero(days), holidays),
    NETWORKDAYS: (startDate: unknown, endDate: unknown, holidays: unknown) =>
        isNil(startDate, endDate) ? null : formulajs.NETWORKDAYS(startDate, endDate, holidays),
};

export const formulajsProxy = new Proxy(formulajs, {
    get: (target, prop) => {
        if (prop in overrides) {
            return overrides[prop as keyof typeof overrides];
        }
        if (prop in target) {
            return target[prop];
        }
        return null;
    },
});
