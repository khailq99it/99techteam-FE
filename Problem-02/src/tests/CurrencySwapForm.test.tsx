import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import CurrencySwapForm from '../components/CurrencySwapForm';
import { useTokenPrices } from '../hooks/useTokenPrices';

// Mock the useTokenPrices hook
jest.mock('../hooks/useTokenPrices', () => ({
  useTokenPrices: jest.fn(),
}));

const mockTokens = [
  { symbol: 'ETH', price: 2000, iconUrl: 'eth.svg' },
  { symbol: 'BTC', price: 40000, iconUrl: 'btc.svg' },
];

const mockUseTokenPrices = useTokenPrices as jest.Mock;

describe('CurrencySwapForm', () => {
  const queryClient = new QueryClient();
  const theme = createTheme();

  beforeEach(() => {
    mockUseTokenPrices.mockReturnValue({
      availableTokens: mockTokens,
      isLoading: false,
      getExchangeRate: (from: string, to: string) => {
        const fromPrice = mockTokens.find(t => t.symbol === from)?.price || 0;
        const toPrice = mockTokens.find(t => t.symbol === to)?.price || 0;
        return fromPrice / toPrice;
      },
    });
  });

  const renderComponent = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CurrencySwapForm />
        </ThemeProvider>
      </QueryClientProvider>
    );
  };

  it('renders the form with initial empty state', () => {
    renderComponent();
    
    expect(screen.getByText('Swap Currencies')).toBeInTheDocument();
    expect(screen.getByText('CONFIRM SWAP')).toBeDisabled();
    expect(screen.getByRole('spinbutton', { name: /amount to send/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /amount to receive/i })).toBeInTheDocument();
  });

  it('shows loading state when fetching token prices', () => {
    mockUseTokenPrices.mockReturnValue({
      availableTokens: [],
      isLoading: true,
      getExchangeRate: () => 0,
    });

    renderComponent();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('calculates exchange rate correctly when tokens are selected', async () => {
    renderComponent();

    // Select tokens using MUI's Select component structure
    const fromTokenButton = screen.getAllByRole('combobox')[0];
    fireEvent.mouseDown(fromTokenButton);
    await waitFor(() => {
      fireEvent.click(screen.getByText('ETH'));
    });
    
    const toTokenButton = screen.getAllByRole('combobox')[1];
    fireEvent.mouseDown(toTokenButton);
    await waitFor(() => {
      fireEvent.click(screen.getByText('BTC'));
    });

    // Enter amount
    const amountInput = screen.getByRole('spinbutton', { name: /amount to send/i });
    fireEvent.change(amountInput, { target: { value: '1' } });

    // Check exchange rate display
    await waitFor(() => {
      expect(screen.getByText(/Exchange Rate: 1 ETH = 0.050000 BTC/)).toBeInTheDocument();
    });
  });

  it('validates input amount', () => {
    renderComponent();

    const amountInput = screen.getByRole('spinbutton', { name: /amount to send/i });
    fireEvent.change(amountInput, { target: { value: '-1' } });

    expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
    expect(screen.getByText('CONFIRM SWAP')).toBeDisabled();
  });

  it('handles form submission', async () => {
    renderComponent();

    // Select tokens using MUI's Select component structure
    const fromTokenButton = screen.getAllByRole('combobox')[0];
    fireEvent.mouseDown(fromTokenButton);
    await waitFor(() => {
      fireEvent.click(screen.getByText('ETH'));
    });
    
    const toTokenButton = screen.getAllByRole('combobox')[1];
    fireEvent.mouseDown(toTokenButton);
    await waitFor(() => {
      fireEvent.click(screen.getByText('BTC'));
    });

    // Enter amount
    const amountInput = screen.getByRole('spinbutton', { name: /amount to send/i });
    fireEvent.change(amountInput, { target: { value: '1' } });

    // Submit form
    const submitButton = screen.getByText('CONFIRM SWAP');
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    // Check loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByText('CONFIRM SWAP')).toBeEnabled();
    }, { timeout: 2000 });
  });
});