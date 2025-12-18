import { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { getOrders, deleteOrder } from '../services/api';
import OrderList from '../components/OrderList';
import Loading from '../components/Loading';

/**
 * Página de Pedidos - Listagem e gerenciamento de pedidos
 */
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar pedidos
  const fetchOrders = async (showRefreshingState = false) => {
    if (showRefreshingState) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await getOrders();
      const ordersList = data.orders || [];
      const sortedOrders = ordersList.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA;
      });
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError(err.message || 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Buscar pedidos ao montar o componente
  useEffect(() => {
    fetchOrders();
  }, []);

  // Deletar pedido
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error('Erro ao deletar pedido:', err);
      throw err;
    }
  };

  // Atualizar pedido
  const handleUpdateOrder = (orderId, updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? updatedOrder : order
      )
    );
  };

  // Atualizar lista de pedidos
  const handleRefresh = () => {
    fetchOrders(true);
  };

  if (loading) {
    return <Loading message="Carregando pedidos..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Meus Pedidos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visualize e gerencie todos os seus pedidos
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </Box>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Contador de pedidos */}
      {!error && orders.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Total de {orders.length} pedido{orders.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      )}

      {/* Lista de pedidos */}
      <OrderList orders={orders} onDelete={handleDeleteOrder} onUpdate={handleUpdateOrder} />
    </Container>
  );
};

export default OrdersPage;
