import * as formulajs from '@formulajs/formulajs';

const isNull = (...args: unknown[]) => args.some((arg) => arg === null);
const nullToZero = (arg: unknown) => (isNull(arg) ? 0 : arg);

const overrides = {
    DATE: (year: unknown, month: unknown, day: unknown) =>
        isNull(year, month, day) ? null : formulajs.DATE(year, month, day),
    DATEVALUE: (dateText: unknown) => (isNull(dateText) ? null : formulajs.DATEVALUE(dateText)),
    DAY: (date: unknown) => (isNull(date) ? null : formulajs.DAY(date)),
    DAYS: (startDate: unknown, endDate: unknown) =>
        isNull(startDate, endDate) ? null : formulajs.DAYS(startDate, endDate),
    DAYS360: (startDate: unknown, endDate: unknown, method: unknown) =>
        isNull(startDate, endDate) ? null : formulajs.DAYS360(startDate, endDate, method),
    EDATE: (startDate: unknown, months: unknown) =>
        isNull(startDate) ? null : formulajs.EDATE(startDate, nullToZero(months)),
    EOMONTH: (startDate: unknown, months: unknown) =>
        isNull(startDate) ? null : formulajs.EOMONTH(startDate, nullToZero(months)),
    HOUR: (date: unknown) => (isNull(date) ? null : formulajs.HOUR(date)),
    INTERVAL: (seconds: unknown) => formulajs.INTERVAL(nullToZero(seconds)),
    ISOWEEKNUM: (date: unknown) => (isNull(date) ? null : formulajs.ISOWEEKNUM(date)),
    MINUTE: (serialNumber: unknown) => (isNull(serialNumber) ? null : formulajs.MINUTE(serialNumber)),
    MONTH: (date: unknown) => (isNull(date) ? null : formulajs.MONTH(date)),
    SECOND: (serialNumber: unknown) => (isNull(serialNumber) ? null : formulajs.SECOND(serialNumber)),
    TIME: (hour: unknown, minute: unknown, second: unknown) =>
        isNull(hour, minute, second) ? null : formulajs.TIME(hour, minute, second),
    TIMEVALUE: (timeText: unknown) => (isNull(timeText) ? null : formulajs.TIMEVALUE(timeText)),
    WEEKDAY: (serialNumber: unknown, returnType: unknown) =>
        isNull(serialNumber) ? null : formulajs.WEEKDAY(serialNumber, returnType),
    WEEKNUM: (serialNumber: unknown, returnType: unknown) =>
        isNull(serialNumber) ? null : formulajs.WEEKNUM(serialNumber, returnType),
    YEAR: (date: unknown) => (isNull(date) ? null : formulajs.YEAR(date)),
    YEARFRAC: (startDate: unknown, endDate: unknown, basis: unknown) =>
        isNull(startDate, endDate) ? null : formulajs.YEARFRAC(startDate, endDate, basis),
    WORKDAY: (startDate: unknown, days: unknown, holidays: unknown) =>
        isNull(startDate) ? null : formulajs.WORKDAY(startDate, nullToZero(days), holidays),
    NETWORKDAYS: (startDate: unknown, endDate: unknown, holidays: unknown) =>
        isNull(startDate, endDate) ? null : formulajs.NETWORKDAYS(startDate, endDate, holidays),
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
