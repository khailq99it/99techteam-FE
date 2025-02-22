import { useState } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Container } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CurrencySwapForm from './components/CurrencySwapForm';

const queryClient = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

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
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
