
# Inefficiencies and Anti-patterns

*   **Incorrect Property Access**: The original code attempts to access a `blockchain` property on the `balance` object, which is undefined. It should be accessing the `currency` property instead.
*   **Typo in Filter Condition**: There's a typo in the filter condition (`lhsPriority` instead of `balancePriority`), causing a `ReferenceError` and breaking the filtering logic.
*   **Incorrect Filter Logic**: The filter logic includes balances with `amount <= 0` instead of filtering them out, leading to unintended display of non-positive balances.
*   **Unnecessary Dependency in `useMemo`**: The `prices` dependency in the `useMemo` hook for `sortedBalances` triggers unnecessary recalculations when prices change, degrading performance.
*   **Incomplete Sort Comparator**: The sort comparator is missing a `return 0` statement for when priorities are equal, potentially causing unstable sorting in some browsers.
*   **Unused Formatted Balances**: The `formattedBalances` are computed but not used in the rendering logic, leading to a runtime error when attempting to access `balance.formatted` from unformatted data.
*   **Index as Key Anti-Pattern**: The code uses the array index as the key prop in the `WalletRow` component, which can cause rendering issues if the list order changes.
*   **Missing Memoization**: The `formattedBalances` are not memoized, causing them to be recalculated on every render and wasting resources.

# Original Code

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Issue: No memoization - recreates function on every render
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      // Issue 1: Using non-existent 'blockchain' property (should be 'currency')
      const balancePriority = getPriority(balance.blockchain);
      
      // Issue 2: Typo 'lhsPriority' instead of 'balancePriority'
      // Issue 3: Incorrect filter logic (amount <= 0)
      if (lhsPriority > -99) {
         if (balance.amount <= 0) {
           return true;
         }
      }
      return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      // Issue: Repeated priority calculations (could be optimized)
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      
      // Issue: Missing return 0 for equal priorities
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
  }, [balances, prices]); // Issue: Unnecessary prices dependency

  // Issue: Unmemoized derived data
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  // Issue 1: Using index as key
  // Issue 2: Using sortedBalances instead of formattedBalances
  // Issue 3: prices access without null-check
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
```

# Refactored Code

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Improvement: Memoized with useCallback to prevent unnecessary recreations
  const getPriority = useCallback((blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis': return 100;
      case 'Ethereum': return 50;
      case 'Arbitrum': return 30;
      case 'Zilliqa':
      case 'Neo': return 20; // Improvement: Combined duplicate cases
      default: return -99;
    }
  }, []);

  // Improvement: Properly memoized sorted balances
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        // Fix: Using correct 'currency' property
        const priority = getPriority(balance.currency);
        // Fix: Corrected filter logic (positive amounts)
        return priority > -99 && balance.amount > 0;
      })
      .sort((a, b) => {
        // Improvement: Single priority calculation per balance
        const aPriority = getPriority(a.currency);
        const bPriority = getPriority(b.currency);
        // Improvement: Simplified numeric sort
        return bPriority - aPriority;
      });
  }, [balances, getPriority]); // Improvement: Correct dependencies

  // Improvement: Memoized formatted balances
  const formattedBalances = useMemo((): FormattedWalletBalance[] => {
    return sortedBalances.map(balance => ({
      ...balance,
      formatted: balance.amount.toFixed(),
    }));
  }, [sortedBalances]);

  // Improvement: Memoized rows with proper keys
  const rows = useMemo(() => {
    return formattedBalances.map((balance) => {
      // Improvement: Null-safe price access
      const usdValue = (prices[balance.currency] || 0) * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency} // Improvement: Stable key
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
```