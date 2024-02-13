export default class ClickUpParser {
  constructor(parsingRules) {
    this._parsingRules = parsingRules;
  }

  parse(expression) {
    let parsedExpression = expression;

    for (const rule of this._parsingRules) {
      parsedExpression = rule(expression);
    }

    return parsedExpression;
  }
}
