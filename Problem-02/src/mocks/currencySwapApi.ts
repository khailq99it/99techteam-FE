interface Token {
  symbol: string;
  amount: number;
}

const mockedTokens: Token[] = [
  {
    symbol: 'WBTC',
    amount: 10,
  },
  {
    symbol: 'USD',
    amount: 5000,
  },
  {
    symbol: 'ETH',
    amount: 5,
  },
];

export const fetchTokens = async (): Promise<Token[]> => {
  return mockedTokens;
};

export const swapCurrencies = async (fromToken: string, toToken: string, fromAmount: number, toAmount: number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Mock swap submitted:', {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
  });

  return {
    success: true,
    message: 'Swap successful',
  };
};