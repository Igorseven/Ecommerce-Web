import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Delete, Visibility, LocalShipping, CheckCircle, Cancel, Check } from '@mui/icons-material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getOrderById, updateOrder } from '../services/api';

/**
 * Componente de Card individual de pedido
 */
const OrderCard = ({ order, onDelete, onUpdate }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmOrder, setOpenConfirmOrder] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [confirmingOrder, setConfirmingOrder] = useState(false);

  const handleOpenDialog = async () => {
    setOpenDialog(true);
    setLoadingDetails(true);
    try {
      const data = await getOrderById(order.id);
      setOrderDetails(data.order);
    } catch (error) {
      toast.error('Erro ao carregar detalhes do pedido', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOrderDetails(null);
  };

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const handleOpenConfirmOrder = () => setOpenConfirmOrder(true);
  const handleCloseConfirmOrder = () => setOpenConfirmOrder(false);

  const handleDelete = async () => {
    handleCloseConfirm();
    try {
      await onDelete(order.id);
      toast.success('Pedido deletado com sucesso!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Erro ao deletar pedido', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const handleConfirmOrder = async () => {
    handleCloseConfirmOrder();
    setConfirmingOrder(true);
    try {
      const updateData = {
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        status: 'confirmed',
      };
      await updateOrder(order.id, updateData);

      // Notificar o componente pai sobre a atualização
      if (onUpdate) {
        onUpdate(order.id, { ...order, status: 'confirmed' });
      }

      toast.success('Pedido confirmado com sucesso!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Erro ao confirmar pedido', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setConfirmingOrder(false);
    }
  };

  // Calcular total do pedido (usar total_amount se disponível, senão calcular dos items)
  const totalAmount = order.total_amount || order.items?.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  ) || 0;

  // Mapear status para cores e ícones
  const statusConfig = {
    pending: { label: 'Pendente', color: 'warning', icon: <LocalShipping /> },
    confirmed: { label: 'Confirmado', color: 'info', icon: <CheckCircle /> },
    processing: { label: 'Em Processamento', color: 'info', icon: <LocalShipping /> },
    shipped: { label: 'Enviado', color: 'primary', icon: <LocalShipping /> },
    delivered: { label: 'Entregue', color: 'success', icon: <CheckCircle /> },
    cancelled: { label: 'Cancelado', color: 'error', icon: <Cancel /> },
  };

  const status = statusConfig[order.status] || statusConfig.pending;

  // Formatar data
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Data não disponível';

  return (
    <>
      <Card
        elevation={2}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Cabeçalho do pedido */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Pedido #{order.id}
            </Typography>
            <Chip
              icon={status.icon}
              label={status.label}
              color={status.color}
              size="small"
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Informações do cliente */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Cliente:</strong> {order.customer_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Email:</strong> {order.customer_email}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Telefone:</strong> {order.customer_phone}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Informações do pedido */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Data:</strong> {orderDate}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Número:</strong> {order.order_number || 'N/A'}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
              Total: ${totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>

        {/* Ações do card */}
        <CardActions sx={{ p: 2, pt: 0, gap: 1, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={handleOpenDialog}
              fullWidth
            >
              Ver Detalhes
            </Button>
            {order.status === 'pending' && (
              <Button
                variant="contained"
                color="success"
                startIcon={confirmingOrder ? <CircularProgress size={16} color="inherit" /> : <Check />}
                onClick={handleOpenConfirmOrder}
                disabled={confirmingOrder}
                fullWidth
              >
                Confirmar
              </Button>
            )}
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleOpenConfirm}
            fullWidth
          >
            Deletar
          </Button>
        </CardActions>
      </Card>

      {/* Dialog de detalhes do pedido */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
        <DialogContent>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : orderDetails ? (
            <>
              {/* Informações do cliente */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Informações do Cliente
                </Typography>
                <Typography variant="body2">
                  <strong>Nome:</strong> {orderDetails.customer_name}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {orderDetails.customer_email}
                </Typography>
                <Typography variant="body2">
                  <strong>Telefone:</strong> {orderDetails.customer_phone}
                </Typography>
              </Box>

              {/* Endereço de entrega */}
              {orderDetails.address && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Endereço de Entrega
                  </Typography>
                  <Typography variant="body2">
                    <strong>CEP:</strong> {orderDetails.address.cep}
                  </Typography>
                  <Typography variant="body2">
                    {orderDetails.address.street}, {orderDetails.address.number}
                    {orderDetails.address.complement && ` - ${orderDetails.address.complement}`}
                  </Typography>
                  <Typography variant="body2">
                    {orderDetails.address.neighborhood} - {orderDetails.address.city}/{orderDetails.address.state}
                  </Typography>
                </Box>
              )}

              {/* Itens do pedido */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Itens do Pedido
                </Typography>
                <Grid container spacing={2}>
                  {orderDetails.items?.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          p: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                        }}
                      >
                        {item.product_image && (
                          <Box
                            component="img"
                            src={item.product_image}
                            alt={item.product_name}
                            sx={{ width: 80, height: 80, objectFit: 'contain' }}
                          />
                        )}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {item.product_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantidade: {item.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Preço unitário: ${item.unit_price.toFixed(2)}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                            Subtotal: ${(item.unit_price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Resumo de Valores */}
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />

                {/* Subtotal dos itens */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">
                    Subtotal:
                  </Typography>
                  <Typography variant="body1">
                    ${orderDetails.items?.reduce((sum, item) => sum + item.total_price, 0).toFixed(2) || '0.00'}
                  </Typography>
                </Box>

                {/* Frete */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">
                    Frete:
                  </Typography>
                  <Typography variant="body1">
                    ${(orderDetails.shipping_cost || 0).toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    ${(orderDetails.total_amount || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <Typography>Erro ao carregar detalhes do pedido</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmação de pedido */}
      <Dialog open={openConfirmOrder} onClose={handleCloseConfirmOrder}>
        <DialogTitle>Confirmar Pedido</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja confirmar o pedido #{order.id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmOrder}>Cancelar</Button>
          <Button onClick={handleConfirmOrder} color="success" variant="contained">
            Confirmar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja deletar o pedido #{order.id}? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderCard;
