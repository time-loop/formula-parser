Formula Parser [![@time-loop/hot-formula-parser](https://img.shields.io/badge/npm-v4.1.0-blue)](https://github.com/time-loop/github-packages/pkgs/npm/hot-formula-parser)
==========
Library provides a `Parser` class that evaluates excel and mathematical formulas.

- - -

## Install

A recommended way to install Formula Parser is through [NPM](https://www.npmjs.com/) using the following command:

```sh
$ npm install --save @time-loop/hot-formula-parser
```

Simple usage:
```js
import { ClickUpParser } from '@time-loop/hot-formula-parser';

const parser = ClickUpParser.create();

parser.parse('SUM(1, 6, 7)'); // It returns `Object {error: null, result: 14}`
```

## Features

It supports:

 * Any numbers, negative and positive as float or integer;
 * Arithmetic operations like `+`, `-`, `/`, `*`, `%`, `^`;
 * Logical operations like `AND()`, `OR()`, `NOT()`, `XOR()`;
 * Comparison operations like `=`, `>`, `>=`, `<`, `<=`, `<>`;
 * All JavaScript Math constants like `PI()`, `E()`, `LN10()`, `LN2()`, `LOG10E()`, `LOG2E()`, `SQRT1_2()`, `SQRT2()`;
 * String operations like `&` (concatenation eq. `parser.parse('-(2&5)');` will return `-25`);
 * All excel formulas defined in [formula.js](https://github.com/handsontable/formula.js);
 * Relative and absolute cell coordinates like `A1`, `$A1`, `A$1`, `$A$1`;
 * Build-in variables like `TRUE`, `FALSE`, `NULL`
 * Custom variables;
 * Custom functions/formulas;
 * Node and Browser environment.

## API (methods)

```js
import { ClickUpParser } from '@time-loop/hot-formula-parser';

const parser = ClickUpParser.create();
```

### .parse(expression)

Parses and evaluates provided expression. It always returns an object with `result` and `error` properties. `result` property
always keep evaluated value. If error occurs `error` property will be set as:
 * `#ERROR!` General error;
 * `#DIV/0!` Divide by zero error;
 * `#NAME?` Not recognised function name or variable name;
 * `#N/A` Indicates that a value is not available to a formula;
 * `#NUM!` Occurs when formula encounters an invalid number;
 * `#VALUE!` Occurs when one of formula arguments is of the wrong type.

```js
parser.parse('(1 + 5 + (5 * 10)) / 10'); // returns `Object {error: null, result: 5.6}`
parser.parse('SUM(MY_VAR)'); // returns `Object {error: "#NAME?", result: null}`
parser.parse('1;;1'); // returns `Object {error: "#ERROR!", result: null}`
```

### .setVariable(name, value)

Set predefined variable name which can be visible while parsing formula expression.

```js
parser.setVariable('MY_VARIABLE', 5);
parser.setVariable('fooBar', 10);

parser.parse('(1 + MY_VARIABLE + (5 * fooBar)) / fooBar'); // returns `5.6`
```

### .getVariable(name)

Get variable name.

```js
parser.setVariable('fooBar', 10);

parser.getVariable('fooBar'); // returns `10`
```

### .setFunction(name, fn)

Set custom function which can be visible while parsing formula expression.

```js
parser.setFunction('ADD_5', function(params) {
  return params[0] + 5;
});
parser.setFunction('GET_LETTER', function(params) {
  var string = params[0];
  var index = params[1] - 1;

  return string.charAt(index);
});

parser.parse('SUM(4, ADD_5(1))'); // returns `10`
parser.parse('GET_LETTER("Some string", 3)'); // returns `m`
```

### .getFunction(name)

Get custom function.

```js
parser.setFunction('ADD_5', function(params) {
  return params[0] + 5;
});

parser.getFunction('ADD_5')([1]); // returns `6`
```

### .SUPPORTED_FORMULAS

List of all supported formulas function.

```js
import { SUPPORTED_FORMULAS } from '@time-loop/hot-formula-parser'; // An array of formula names
```

## API (hooks)

### 'callVariable' (name, done)

Fired while retrieving variable. If variable was defined earlier using `setVariable` you can overwrite it by this hook.

```js
parser.on('callVariable', function(name, done) {
  if (name === 'foo') {
    done(Math.PI / 2);
  }
});

parser.parse('SUM(SIN(foo), COS(foo))'); // returns `1`
```

### 'callFunction' (name, params, done)

Fired while calling function. If function was defined earlier using `setFunction` you can overwrite it's result by this hook.
You can also use this to override result of build-in formulas.

```js
parser.on('callFunction', function(name, params, done) {
  if (name === 'ADD_5') {
    done(params[0] + 5);
  }
});

parser.parse('ADD_5(3)'); // returns `8`
```

### 'callCellValue' (cellCoord, done)

Fired while retrieving cell value by its label (eq: `B3`, `B$3`, `B$3`, `$B$3`).

```js
parser.on('callCellValue', function(cellCoord, done) {
  // using label
  if (cellCoord.label === 'B$6') {
    done('hello');
  }
  // or using indexes
  if (cellCoord.row.index === 5 && cellCoord.row.isAbsolute && cellCoord.column.index === 1 && !cellCoord.column.isAbsolute) {
    done('hello');
  }

  if (cellCoord.label === 'C6') {
    done(0.75);
  }
});

parser.parse('B$6'); // returns `"hello"`
parser.parse('B$6&" world"'); // returns `"hello world"`
parser.parse('FISHER(C6)'); // returns `0.9729550745276566`
```

### 'callRangeValue' (startCellCoord, endCellCoord, done)

Fired while retrieving cells range value (eq: `A1:B3`, `$A1:B$3`, `A$1:B$3`, `$A$1:$B$3`).

```js
parser.on('callRangeValue', function(startCellCoord, endCellCoord, done) {
  var data = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
  ];
  var fragment = [];

  for (var row = startCellCoord.row.index; row <= endCellCoord.row.index; row++) {
    var rowData = data[row];
    var colFragment = [];

    for (var col = startCellCoord.column.index; col <= endCellCoord.column.index; col++) {
      colFragment.push(rowData[col]);
    }
    fragment.push(colFragment);
  }

  if (fragment) {
    done(fragment);
  }
});

parser.parse('JOIN(A1:E2)'); // returns `"1,2,3,4,5,6,7,8,9,10"`
parser.parse('COLUMNS(A1:E2)'); // returns `5`
parser.parse('ROWS(A1:E2)'); // returns `2`
parser.parse('COUNT(A1:E2)'); // returns `10`
parser.parse('COUNTIF(A1:E2, ">5")'); // returns `5`
```
