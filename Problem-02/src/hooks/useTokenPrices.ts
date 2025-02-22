import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface TokenPrice {
  currency: string;
  price: number;
  date: string;
}

interface TokenOption {
  symbol: string;
  price: number;
  iconUrl: string;
}

// Map API currency names to display symbols
const currencyToSymbol: Record<string, string> = {
  'WBTC': 'BTC',
  'WETH': 'ETH',
  'USDC': 'USD',
};

export const useTokenPrices = () => {
  const { data: tokenPrices, isLoading, error } = useQuery<TokenPrice[]>({
    queryKey: ['tokenPrices'],
    queryFn: async () => {
      const response = await axios.get('https://interview.switcheo.com/prices.json');
      return response.data;
    },
  });

  const availableTokens: TokenOption[] = tokenPrices
    ? tokenPrices
        .filter(token => token.price > 0)
        .map(token => {
          const symbol = currencyToSymbol[token.currency] || token.currency;
          // Use the display symbol for the icon URL
          const iconCurrency = symbol === 'USD' ? 'USDC' : symbol;
          return {
            symbol,
            price: token.price,
            iconUrl: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${iconCurrency}.svg`,
          };
        })
    : [];

  const getExchangeRate = (fromToken: string, toToken: string): number => {
    const fromPrice = availableTokens.find(t => t.symbol === fromToken)?.price || 0;
    const toPrice = availableTokens.find(t => t.symbol === toToken)?.price || 0;
    
    if (fromPrice && toPrice) {
      return fromPrice / toPrice;
    }
    return 0;
  };

  return {
    availableTokens,
    isLoading,
    error,
    getExchangeRate,
  };
};