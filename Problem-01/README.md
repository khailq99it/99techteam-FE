# Problem 1: Three ways to sum to n

This project provides three different JavaScript implementations to calculate the sum of numbers from 1 to n.

## Implementations

*   **sum\_to\_n\_a(n):** Uses a loop to calculate the sum. Time complexity: O(n).
*   **sum\_to\_n\_b(n):** Uses recursion to calculate the sum. Time complexity: O(n).
*   **sum\_to\_n\_c(n):** Uses the arithmetic progression formula to calculate the sum. Time complexity: O(1).

## Setup

1.  Clone the repository.
2.  Navigate to the project directory: `cd Problem-01`
3.  Install dependencies: `yarn install`

## Usage

```javascript
const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./sum_functions');

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));
```

## Running the program

To run the program, use the following command:

```bash
yarn start
```

## Running Tests

To run the unit tests, use the following command:

```bash
yarn test