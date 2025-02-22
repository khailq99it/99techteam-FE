import { useState, useEffect } from 'react';
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
import { useTokenPrices } from '../hooks/useTokenPrices';

const CurrencySwapForm = () => {
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { availableTokens, isLoading, getExchangeRate } = useTokenPrices();

  // Update to amount whenever dependencies change
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const exchangeRate = getExchangeRate(fromToken, toToken);
      const result = Number(fromAmount) * exchangeRate;
      setToAmount(result.toFixed(6));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken, getExchangeRate]);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleSubmit = async () => {
    if (!fromAmount || !toAmount || !fromToken || !toToken) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Swap submitted:', {
        fromToken,
        toToken,
        fromAmount,
        toAmount,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  // Remove duplicate tokens by using symbol as unique identifier
  const uniqueTokens = Array.from(
    new Map(availableTokens.map(token => [token.symbol, token])).values()
  );

  return (
    <Card sx={{ minWidth: 375, maxWidth: 500 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Swap Currencies
        </Typography>

        <Box mb={3}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>From Token</InputLabel>
            <Select
              value={fromToken}
              label="From Token"
              onChange={(e) => {
                setFromToken(e.target.value);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={uniqueTokens.find(t => t.symbol === selected)?.iconUrl}
                    alt={selected}
                    sx={{ width: 24, height: 24 }}
                  />
                  {selected}
                </Box>
              )}
            >
              {uniqueTokens.map((token) => (
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
            value={fromAmount}
            onChange={(e) => handleFromAmountChange(e.target.value)}
            error={fromAmount !== '' && Number(fromAmount) <= 0}
            helperText={fromAmount !== '' && Number(fromAmount) <= 0 ? 'Amount must be greater than 0' : ''}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>To Token</InputLabel>
            <Select
              value={toToken}
              label="To Token"
              onChange={(e) => {
                setToToken(e.target.value);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={uniqueTokens.find(t => t.symbol === selected)?.iconUrl}
                    alt={selected}
                    sx={{ width: 24, height: 24 }}
                  />
                  {selected}
                </Box>
              )}
            >
              {uniqueTokens.map((token) => (
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

          {fromToken && toToken && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Exchange Rate: 1 {fromToken} = {getExchangeRate(fromToken, toToken).toFixed(6)} {toToken}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!fromAmount || !toAmount || !fromToken || !toToken || isSubmitting || Number(fromAmount) <= 0}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'CONFIRM SWAP'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CurrencySwapForm;