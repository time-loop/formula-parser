function parseArgument(el) {
  return JSON.parse(el);
}

function filterEmptyArguments(el) {
  return el !== '';
}

/**
 * @description
 * ! As for now it does not support arrays.
 * ex: MEDIAN([0,1,2])
 *
 * @param formula - Provide a formula to split.
 * @returns {{args: *, name: String}}
 *
 * @examples
 * splitFormula(DATE(2024, 1, 1)) -> {name: 'DATE', args: [2024, 1, 1]}
 * splitFormula(MEDIAN([0,1,2])) -> {name: 'MEDIAN', args: [[0, 1, 2]]}
 */
export default function splitFormula(formula) {
  const [name, argsString] = formula.split('(');
  const args = argsString.split(')')[0].split(',').filter(filterEmptyArguments);

  return {
    name,
    args: args.map(parseArgument),
  };
}

