import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect } from 'react';

import { fetchTokens } from '../mocks/currencySwapApi';
import { useCurrencySwapStore } from '../store/currencySwapStore';
export interface TokenPrice {
  currency: string;
  price: number;
  date: string;
}

export interface TokenOption extends TokenPrice {
  symbol: string;
  iconUrl: string;
}

const fetchTokenPrices = async (): Promise<TokenPrice[]> => {
  const response = await axios.get('https://interview.switcheo.com/prices.json');

  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.data;
};

export const useTokenPrices = () => {
  const { setTokenBalances } = useCurrencySwapStore();
  const { data: tokenPricesData, isLoading, error } = useQuery<TokenPrice[], Error, TokenOption[]>({
    queryKey: ['tokenPrices'],
    queryFn: fetchTokenPrices,
    select: (data): TokenOption[] => {
      if (!data) return [];

      const processedTokens = data.reduce<TokenOption[]>((acc, token) => {
        if (token.price <= 0) return acc;

        const symbol = token.currency.toUpperCase();
        const iconUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${encodeURIComponent(symbol)}.svg`;

        const existingTokenIndex = acc.findIndex(t => t.symbol === symbol);

        if (existingTokenIndex === -1) {
          acc.push({ ...token, symbol, iconUrl });
        } else {
          const existingToken = acc[existingTokenIndex];
          const tokenDate = new Date(token.date);
          const existingTokenDate = new Date(existingToken.date);

          if (tokenDate > existingTokenDate) {
            acc[existingTokenIndex] = { ...token, symbol, iconUrl };
          } else if (tokenDate.getTime() === existingTokenDate.getTime() && data.indexOf(token) > data.indexOf(existingToken)) {
            acc[existingTokenIndex] = { ...token, symbol, iconUrl };
          }
        }

        return acc;
      }, []);

      // Sort tokens alphabetically by symbol
      processedTokens.sort((a, b) => a.symbol.localeCompare(b.symbol));

      return processedTokens;
    },
  });
  
  useEffect(() => {
    const initializeBalances = async () => {
      if (tokenPricesData) {
        const mockedTokens = await fetchTokens();
        const initialBalances: { [symbol: string]: number } = {};
        mockedTokens.forEach((token: { symbol: string; amount: number }) => {
          initialBalances[token.symbol] = token.amount;
        });

        tokenPricesData.forEach((token: TokenOption) => {
          if (!initialBalances[token.symbol]) {
            initialBalances[token.symbol] = 0;
          }
        });
        setTokenBalances(initialBalances);
      }
    };

    initializeBalances();
  }, [tokenPricesData, setTokenBalances]);

  const availableTokens = useCallback(() => tokenPricesData || [], [tokenPricesData]);

  const getExchangeRate = useCallback((fromToken: string, toToken: string): number => {
    const fromPrice = tokenPricesData?.find((t) => t.symbol === fromToken)?.price || 0;
    const toPrice = tokenPricesData?.find((t) => t.symbol === toToken)?.price || 0;

    if (fromPrice && toPrice) {
      return fromPrice / toPrice;
    }
    return 0;
  }, [tokenPricesData]);

  return {
    availableTokens: availableTokens(),
    isLoading,
    error,
    getExchangeRate,
  };
};