import { ThemeProvider, CssBaseline, createTheme, Container, Snackbar, Alert } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CurrencySwapForm from './components/CurrencySwapForm';
import { useCurrencySwapStore } from './store/currencySwapStore';

const queryClient = new QueryClient();

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const { ui, setUi } = useCurrencySwapStore();
  const { open, severity, message } = ui;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{ 
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <CurrencySwapForm />
        </Container>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setUi({ open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setUi({ open: false })} severity={severity} sx={{ width: '100%' }}>{message}</Alert>
        </Snackbar>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
