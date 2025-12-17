import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box } from '@mui/material';
import { ShoppingCart, ListAlt, Storefront } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * Componente de Header com navegação e contador do carrinho
 */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();

  const totalItems = getTotalItems();
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        {/* Logo e título */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Storefront sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            E-Commerce MVP
          </Typography>
        </Box>

        {/* Navegação */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Botão Produtos */}
          <Button
            color="inherit"
            startIcon={<Storefront />}
            onClick={() => navigate('/')}
            sx={{
              fontWeight: isActive('/') ? 'bold' : 'normal',
              backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            Produtos
          </Button>

          {/* Botão Pedidos */}
          <Button
            color="inherit"
            startIcon={<ListAlt />}
            onClick={() => navigate('/orders')}
            sx={{
              fontWeight: isActive('/orders') ? 'bold' : 'normal',
              backgroundColor: isActive('/orders') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            Pedidos
          </Button>

          {/* Botão Carrinho com Badge */}
          <IconButton
            color="inherit"
            onClick={() => navigate('/checkout')}
            sx={{
              ml: 1,
              backgroundColor: isActive('/checkout') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
