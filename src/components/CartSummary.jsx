import { Paper, Typography, Box, Divider, IconButton } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

/**
 * Componente de resumo do carrinho
 */
const CartSummary = ({ shippingCost = 0 }) => {
  const { items, getTotalPrice, incrementQuantity, decrementQuantity, removeFromCart } = useCart();

  const subtotal = getTotalPrice();
  const totalPrice = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Carrinho Vazio
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Adicione produtos ao carrinho para fazer um pedido
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Resumo do Pedido
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Lista de itens */}
      {items.map((item) => (
        <Box
          key={item.product_id}
          sx={{
            mb: 2,
            pb: 2,
            borderBottom: '1px solid #e0e0e0',
            '&:last-child': {
              borderBottom: 'none',
            },
          }}
        >
          {/* Produto */}
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            {item.product_image && (
              <Box
                component="img"
                src={item.product_image}
                alt={item.product_name}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'contain',
                  borderRadius: 1,
                  backgroundColor: '#f9f9f9',
                }}
              />
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {item.product_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.unit_price.toFixed(2)} cada
              </Typography>
            </Box>
          </Box>

          {/* Controles de quantidade */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => decrementQuantity(item.product_id)}
                sx={{ border: '1px solid', borderColor: 'primary.main' }}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                {item.quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => incrementQuantity(item.product_id)}
                sx={{ border: '1px solid', borderColor: 'primary.main' }}
              >
                <Add fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => removeFromCart(item.product_id)}
                sx={{ ml: 1 }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              ${(item.unit_price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      {/* Subtotal */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1">
          Subtotal:
        </Typography>
        <Typography variant="body1">
          ${subtotal.toFixed(2)}
        </Typography>
      </Box>

      {/* Frete */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1">
          Frete:
        </Typography>
        <Typography variant="body1" color={shippingCost === 0 ? 'text.secondary' : 'inherit'}>
          {shippingCost === 0 ? 'Calcular' : `R$ ${shippingCost.toFixed(2)}`}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Total:
        </Typography>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
          ${totalPrice.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CartSummary;
