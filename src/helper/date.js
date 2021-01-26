
// eslint-disable-next-line import/prefer-default-export
export function dateToNumber(val) {
  if (val instanceof Date) {
    return val.getTime();
  }
  return val;
}
