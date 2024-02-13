const TodayRegexDefinition = 'TODAY\\(\\)';
const DateRegexDefinition = 'DATE\\(\\d{4},\\s*\\d{1,2},\\s*\\d{1,2}\\)';

const ValidDateCombination = `(${TodayRegexDefinition}|${DateRegexDefinition})`;

const DateSubtractionRegex = new RegExp(`${ValidDateCombination}\\s*-\\s*${ValidDateCombination}`, 'gm');

export default function rule(expression) {
  return expression.replaceAll(DateSubtractionRegex, (match) => {
    const [endDate, startDate] = match.split('-');
    return `DAYS(${endDate.trim()}, ${startDate.trim()})`;
  });
}
