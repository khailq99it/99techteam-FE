# Solved Problems Summary

This document provides a summary of the solved problems in this repository.
Please go into each problem's folder for more details.

## Problem 1: Three ways to sum to n

This project provides three different JavaScript implementations to calculate the sum of numbers from 1 to n.

*   **sum\_to\_n\_a(n):** Uses a loop to calculate the sum. Time complexity: O(n).
*   **sum\_to\_n\_b(n):** Uses recursion to calculate the sum. Time complexity: O(n).
*   **sum\_to\_n\_c(n):** Uses the arithmetic progression formula to calculate the sum. Time complexity: O(1).

## Problem 2: Currency Swap Form

Demo site: https://thriving-hotteok-6d8e54.netlify.app/

A modern currency swap form application built with React, TypeScript, and Material-UI.

Key features:

*   Modern UI with dark mode support
*   Real-time token price data integration
*   Token icons from Switcheo repository
*   Form validation and error handling
*   Loading states and simulated backend interaction

## Problem 3: Inefficiencies and Anti-patterns

This problem identifies and refactors inefficiencies and anti-patterns in a React component for displaying wallet balances.

Key improvements:

*   **Incorrect Property Access**: Fixed accessing the `currency` property instead of the undefined `blockchain` property.
*   **Typo in Filter Condition**: Corrected the typo in the filter condition (`lhsPriority` instead of `balancePriority`).
*   **Incorrect Filter Logic**: Updated the filter logic to exclude balances with non-positive amounts.
*   **Unnecessary Dependency in `useMemo`**: Removed the `prices` dependency in the `useMemo` hook for `sortedBalances`.
*   **Incomplete Sort Comparator**: Added a `return 0` statement for when priorities are equal in the sort comparator.
*   **Unused Formatted Balances**: Ensured the `formattedBalances` are properly computed and used in the rendering logic.
*   **Index as Key Anti-Pattern**: Replaced the array index as the key prop with a stable key in the `WalletRow` component.
*   **Missing Memoization**: Memoized the `formattedBalances` to prevent unnecessary recalculations.