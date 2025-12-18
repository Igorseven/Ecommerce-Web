import { useState } from 'react';
import { Container, Typography, Box, Grid, Alert, Button } from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import CheckoutForm from '../components/CheckoutForm';
import CartSummary from '../components/CartSummary';
import { toast } from 'react-toastify';

/**
 * Página de Checkout - Finalização do pedido
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  const totalItems = getTotalItems();

  // Callback quando o frete for calculado
  const handleShippingCalculated = (cost) => {
    setShippingCost(cost);
  };

  // Submeter pedido
  const handleSubmit = async (customerData) => {
    setLoading(true);

    try {
      // Montar objeto do pedido
      const orderData = {
        customer_name: customerData.customer_name,
        customer_email: customerData.customer_email,
        customer_phone: customerData.customer_phone,
        address: customerData.address,
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      console.log('Enviando pedido:', orderData);

      // Enviar pedido para o backend
      const response = await createOrder(orderData);

      console.log('Pedido criado com sucesso:', response);

      clearCart();

      toast.success('Pedido criado com sucesso!', {
        position: 'bottom-right',
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error(
        error.message || 'Erro ao criar pedido',
        {
          position: 'bottom-right',
          autoClose: 5000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Carrinho vazio
  if (totalItems === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Seu carrinho está vazio
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Adicione produtos ao carrinho para fazer um pedido
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Ver Produtos
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Continuar Comprando
        </Button>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Finalizar Pedido
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Preencha seus dados para concluir a compra
        </Typography>
      </Box>

      {/* Alerta informativo */}
      <Alert severity="info" sx={{ mb: 4 }}>
        Preencha o CEP para buscar automaticamente seu endereço. Certifique-se de que o backend
        está rodando para validação do CEP.
      </Alert>

      {/* Grid responsivo */}
      <Grid container spacing={4}>
        {/* Formulário de checkout */}
        <Grid item xs={12} md={7}>
          <CheckoutForm
            onSubmit={handleSubmit}
            loading={loading}
            onShippingCalculated={handleShippingCalculated}
          />
        </Grid>

        {/* Resumo do carrinho */}
        <Grid item xs={12} md={5}>
          <CartSummary shippingCost={shippingCost} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
