import { Grid, Box, Typography } from '@mui/material';
import OrderCard from './OrderCard';

/**
 * Componente de lista de pedidos
 */
const OrderList = ({ orders, onDelete, onUpdate }) => {
  if (!orders || orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Nenhum pedido encontrado
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Você ainda não fez nenhum pedido. Comece adicionando produtos ao carrinho!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {orders.map((order) => (
        <Grid item xs={12} sm={6} md={4} key={order.id}>
          <OrderCard order={order} onDelete={onDelete} onUpdate={onUpdate} />
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderList;
