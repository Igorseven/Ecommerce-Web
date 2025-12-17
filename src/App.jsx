import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { CartProvider } from './context/CartContext';

// Components
import Header from './components/Header';

// Pages
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';

// Configuração do tema Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul
    },
    secondary: {
      main: '#ff6f00', // Laranja
    },
    background: {
      default: '#f5f5f5', // Cinza claro
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Desabilitar uppercase automático
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

/**
 * Componente principal da aplicação
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              backgroundColor: 'background.default',
            }}
          >
            {/* Header fixo */}
            <Header />

            {/* Conteúdo principal */}
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<ProductsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Routes>
            </Box>

            {/* Footer */}
            <Box
              component="footer"
              sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: 'primary.main',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                E-Commerce MVP - Projeto Pós-Graduação © {new Date().getFullYear()}
              </Box>
            </Box>
          </Box>

          {/* Toast notifications */}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
