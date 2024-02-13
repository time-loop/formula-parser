export function isDate(val) {
  return val instanceof Date;
}

export function dateToNumber(val) {
  if (isDate(val)) {
    return val.getTime();
  }

  return val;
}

function isNullOrFalse(arg) {
  return arg === null || arg === false;
}

export function canCompareArgs(arg1, arg2) {
  return !(isDate(arg1) && isNullOrFalse(arg2) || isDate(arg2) && isNullOrFalse(arg1));
}

export function getNumberOfDaysSinceEpoch(date) {
  const millisecondsInADay = 8.64e7;
  return Math.floor(dateToNumber(date) / millisecondsInADay);
}
