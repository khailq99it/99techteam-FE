import { create } from 'zustand';

interface CurrencySwapState {
  tokenBalances: { [symbol: string]: number };
  ui: {
    open: boolean;
    severity: 'success' | 'error' | 'info' | 'warning';
    message: string;
  };
  setTokenBalance: (symbol: string, balance: number) => void;
  setTokenBalances: (balances: { [symbol: string]: number }) => void;
  setUi: (ui: Partial<CurrencySwapState['ui']>) => void;
}

export const useCurrencySwapStore = create<CurrencySwapState>()((set) => ({
  tokenBalances: {},
  ui: {
    open: false,
    severity: 'success',
    message: '',
  },
  setTokenBalance: (symbol: string, balance: number) =>
    set((state) => ({
      tokenBalances: { ...state.tokenBalances, [symbol]: balance },
    })),
  setTokenBalances: (balances: { [symbol: string]: number }) =>
    set(() => ({
      tokenBalances: balances,
    })),
  setUi: (ui) => set((state) => ({ ui: { ...state.ui, ...ui } })),
}));