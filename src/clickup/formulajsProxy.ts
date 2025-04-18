import * as formulajs from '@formulajs/formulajs';
import { hasNil, nilToZero } from './utils';

const overrides = {
    DATE: (year: unknown, month: unknown, day: unknown) =>
        hasNil(year, month, day) ? Number.NaN : formulajs.DATE(year, month, day),
    DATEVALUE: (dateText: unknown) => (hasNil(dateText) ? Number.NaN : formulajs.DATEVALUE(dateText)),
    DAY: (date: unknown) => (hasNil(date) ? Number.NaN : formulajs.DAY(date)),
    DAYS: (startDate: unknown, endDate: unknown) =>
        hasNil(startDate, endDate) ? Number.NaN : formulajs.DAYS(startDate, endDate),
    DAYS360: (startDate: unknown, endDate: unknown, method: unknown) =>
        hasNil(startDate, endDate) ? Number.NaN : formulajs.DAYS360(startDate, endDate, method),
    EDATE: (startDate: unknown, months: unknown) =>
        hasNil(startDate) ? Number.NaN : formulajs.EDATE(startDate, nilToZero(months)),
    EOMONTH: (startDate: unknown, months: unknown) =>
        hasNil(startDate) ? Number.NaN : formulajs.EOMONTH(startDate, nilToZero(months)),
    HOUR: (date: unknown) => (hasNil(date) ? Number.NaN : formulajs.HOUR(date)),
    INTERVAL: (seconds: unknown) => formulajs.INTERVAL(nilToZero(seconds)),
    ISOWEEKNUM: (date: unknown) => (hasNil(date) ? Number.NaN : formulajs.ISOWEEKNUM(date)),
    MINUTE: (serialNumber: unknown) => (hasNil(serialNumber) ? Number.NaN : formulajs.MINUTE(serialNumber)),
    MONTH: (date: unknown) => (hasNil(date) ? Number.NaN : formulajs.MONTH(date)),
    SECOND: (serialNumber: unknown) => (hasNil(serialNumber) ? Number.NaN : formulajs.SECOND(serialNumber)),
    TIME: (hour: unknown, minute: unknown, second: unknown) =>
        hasNil(hour, minute, second) ? Number.NaN : formulajs.TIME(hour, minute, second),
    TIMEVALUE: (timeText: unknown) => (hasNil(timeText) ? Number.NaN : formulajs.TIMEVALUE(timeText)),
    WEEKDAY: (serialNumber: unknown, returnType: unknown) =>
        hasNil(serialNumber) ? Number.NaN : formulajs.WEEKDAY(serialNumber, returnType),
    WEEKNUM: (serialNumber: unknown, returnType: unknown) =>
        hasNil(serialNumber) ? Number.NaN : formulajs.WEEKNUM(serialNumber, returnType),
    YEAR: (date: unknown) => (hasNil(date) ? Number.NaN : formulajs.YEAR(date)),
    YEARFRAC: (startDate: unknown, endDate: unknown, basis: unknown) =>
        hasNil(startDate, endDate) ? Number.NaN : formulajs.YEARFRAC(startDate, endDate, basis),
    WORKDAY: (startDate: unknown, days: unknown, holidays: unknown) =>
        hasNil(startDate) ? Number.NaN : formulajs.WORKDAY(startDate, nilToZero(days), holidays),
    NETWORKDAYS: (startDate: unknown, endDate: unknown, holidays: unknown) =>
        hasNil(startDate, endDate) ? Number.NaN : formulajs.NETWORKDAYS(startDate, endDate, holidays),
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
