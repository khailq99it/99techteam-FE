import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
} from '@mui/material';
import { TokenOption, useTokenPrices } from '../hooks/useTokenPrices';
import IconButton from '@mui/material/IconButton';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import React from 'react';
import { swapCurrencies } from '../mocks/currencySwapApi';
import { useCurrencySwapStore } from '../store/currencySwapStore';

const CurrencySwapForm = () => {
  const {
    tokenBalances,
    setTokenBalance,
    setUi,
  } = useCurrencySwapStore();

  const [fromToken, setFromToken] = useState('WBTC');
  const [toToken, setToToken] = useState('USD');
  const [swapFromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSwapReversed, setIsSwapReversed] = useState(false);

  const { availableTokens, isLoading, getExchangeRate } = useTokenPrices();

  // Update toAmount whenever dependencies change
  useEffect(() => {
    if (swapFromAmount && fromToken && toToken) {
      const exchangeRate = getExchangeRate(fromToken, toToken);
      const result = Number(swapFromAmount) * exchangeRate;
      setToAmount(Number(result.toFixed(6)));
    } else {
      setToAmount(0);
    }
  }, [swapFromAmount, fromToken, toToken, getExchangeRate]);

  // Handle reversing the from and to tokens
  const handleReverseTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    setIsSwapReversed(!isSwapReversed);
  }, [fromToken, toToken, setIsSwapReversed]);

  // Function to update balances after a successful swap
  const updateBalances = (fromToken: string, toToken: string, fromAmount: number, toAmount: number) => {
    setTokenBalance(fromToken, tokenBalances[fromToken] - fromAmount);
    setTokenBalance(toToken, tokenBalances[toToken] + toAmount);
  };

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!swapFromAmount || !toAmount || !fromToken || !toToken) return;

    setIsSubmitting(true);
    try {
      // Call mock API
      const result = await swapCurrencies(fromToken, toToken, swapFromAmount, toAmount);

      if (!result) {
        setUi({ message: 'Swap failed: Unknown error occurred.', severity: 'error', open: true });
      }
      console.log('Swap result:', {
        fromToken,
        toToken,
        swapFromAmount,
        toAmount,
      });

      // Update balances
      updateBalances(fromToken, toToken, swapFromAmount, toAmount);

      // Show success notification
      setUi({ message: `Swapped ${swapFromAmount} ${fromToken} for ${toAmount} ${toToken}`, severity: 'success', open: true });

    } catch (error: any) {
      let errorMessage = 'Swap failed: An unexpected error occurred.';
      if (error instanceof Error) {
          errorMessage = `Swap failed: ${error.message}`;
      }
      console.error('Swap failed:', errorMessage);

      // Show error notification
      setUi({ message: `Swap failed: ${errorMessage}`, severity: 'error', open: true });
    } finally {
      setIsSubmitting(false);
    }
  }, [swapFromAmount, toAmount, fromToken, toToken, setIsSubmitting, setUi, updateBalances, tokenBalances, setTokenBalance]);

  // Show loading indicator while data is loading
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  // Render the form
  return (
    <Card sx={{ minWidth: 450 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align='center' marginBottom={2}>
          Swap Currencies
        </Typography>

        <Box display="flex" alignItems="center" mb={3}>
          <Box display="flex" flexDirection="column" mr={2}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>From Token</InputLabel>
              <Select
                value={fromToken}
                label="From Token"
                onChange={(event) => {
                  setFromToken(event.target.value);
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={availableTokens.find(t => t.symbol === selected)?.iconUrl}
                      alt={selected}
                      sx={{ width: 24, height: 24 }}
                    />
                    {selected}
                  </Box>
                )}
              >
                {availableTokens.map((token: TokenOption) => (
                  <MenuItem key={token.symbol} value={token.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={token.iconUrl}
                        alt={token.symbol}
                        sx={{ width: 24, height: 24 }}
                      />
                      {token.symbol}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Amount to send"
              type="number"
              value={swapFromAmount}
              onChange={(e) => setFromAmount(Math.abs(Number(e.target.value)))}
              error={String(swapFromAmount) !== '' && swapFromAmount <= 0}
              helperText={String(swapFromAmount) !== '' && swapFromAmount <= 0 ? 'Amount must be greater than 0' : ''}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="caption" display="block" gutterBottom>Balance: {tokenBalances[fromToken]} {fromToken}</Typography>
          </Box>

          <IconButton
            onClick={handleReverseTokens}
            sx={{
              borderRadius: '50%',
              border: '1px solid #ccc',
              ml: 1,
              mr: 1,
            }}
          >
            <SwapHorizIcon />
          </IconButton>

          <Box display="flex" flexDirection="column" ml={2}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>To Token</InputLabel>
              <Select
                value={toToken}
                label="To Token"
                onChange={(event) => {
                  setToToken(event.target.value);
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={availableTokens.find(t => t.symbol === selected)?.iconUrl}
                      alt={selected}
                      sx={{ width: 24, height: 24 }}
                    />
                    {selected}
                  </Box>
                )}
              >
                {availableTokens.map((token: TokenOption) => (
                  <MenuItem key={token.symbol} value={token.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={token.iconUrl}
                        alt={token.symbol}
                        sx={{ width: 24, height: 24 }}
                      />
                      {token.symbol}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Amount to receive"
              type="number"
              value={toAmount}
              disabled
              sx={{ mb: 2 }}
            />

            <Typography variant="caption" display="block" gutterBottom>Balance: {tokenBalances[toToken]} {toToken}</Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!swapFromAmount || !toAmount || !fromToken || !toToken || isSubmitting || Number(swapFromAmount) <= 0}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'CONFIRM SWAP'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default React.memo(CurrencySwapForm);