import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { ShoppingCart, LocalShipping } from '@mui/icons-material';
import { validateCep } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Componente de formulário de checkout
 */
const CheckoutForm = ({ onSubmit, loading, onShippingCalculated }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    cep: '',
    complemento: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    rua: '',
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [errors, setErrors] = useState({});
  const [shippingInfo, setShippingInfo] = useState(null);

  // Formatar CEP (xxxxx-xxx)
  const formatCep = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Formatar telefone ((xx) xxxxx-xxxx)
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers;
    }
    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Atualizar campo do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    // Aplicar formatação para CEP
    if (name === 'cep') {
      formattedValue = formatCep(value);
    }

    // Aplicar formatação para telefone
    if (name === 'customer_phone') {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Limpar erro do campo ao editar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Buscar endereço por CEP
  const handleCepBlur = async () => {
    const cleanCep = formData.cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      return;
    }

    setLoadingCep(true);

    try {
      const addressData = await validateCep(cleanCep, true);

      if (addressData.erro) {
        toast.error('CEP não encontrado', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        return;
      }

      // Preencher campos automaticamente
      setFormData((prev) => ({
        ...prev,
        rua: addressData.street || '',
        bairro: addressData.neighborhood || '',
        cidade: addressData.city || '',
        estado: addressData.state || '',
        numero: addressData.complement.replace(/\D/g, '') || '',
      }));

      // Armazenar informações de frete
      if (addressData.shipping) {
        setShippingInfo({
          cost: addressData.shipping.final_cost,
          freeShipping: addressData.shipping.free_shipping,
          message: addressData.shipping.message,
          estimatedDays: addressData.estimated_delivery_days,
        });

        // Notificar componente pai sobre o frete
        if (onShippingCalculated) {
          onShippingCalculated(addressData.shipping.final_cost);
        }
      }

      toast.success('Endereço e frete calculados!', {
        position: 'bottom-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Erro ao validar CEP:', error);
      toast.error(error.message || 'Erro ao buscar CEP', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setLoadingCep(false);
    }
  };

  // Validar formulário
  const validate = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Nome é obrigatório';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email inválido';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Telefone é obrigatório';
    }

    const cleanCep = formData.cep.replace(/\D/g, '');
    if (!cleanCep) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (cleanCep.length !== 8) {
      newErrors.cep = 'CEP deve ter 8 dígitos';
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    if (!formData.rua.trim()) {
      newErrors.rua = 'Rua é obrigatória';
    }

    if (!formData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Por favor, preencha todos os campos obrigatórios', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      return;
    }

    // Preparar dados do endereço
    const addressData = {
      cep: formData.cep.replace(/\D/g, ''),
      number: formData.numero,
      complement: formData.complemento,
    };

    // Enviar dados
    onSubmit({
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone.replace(/\D/g, ''),
      address: addressData,
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Informações de Entrega
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Informações do cliente */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome Completo"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              error={!!errors.customer_name}
              helperText={errors.customer_name}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={handleChange}
              error={!!errors.customer_email}
              helperText={errors.customer_email}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              error={!!errors.customer_phone}
              helperText={errors.customer_phone}
              placeholder="(00) 00000-0000"
              required
            />
          </Grid>

          {/* Endereço */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="CEP"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              onBlur={handleCepBlur}
              error={!!errors.cep}
              helperText={errors.cep}
              placeholder="00000-000"
              required
              InputProps={{
                endAdornment: loadingCep && <CircularProgress size={20} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Rua"
              name="rua"
              value={formData.rua}
              onChange={handleChange}
              error={!!errors.rua}
              helperText={errors.rua}
              required
              disabled={loadingCep}
              InputLabelProps={{ shrink: !!formData.rua }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Número"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              error={!!errors.numero}
              helperText={errors.numero}
              required
              InputLabelProps={{ shrink: !!formData.numero }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Complemento"
              name="complemento"
              value={formData.complemento}
              onChange={handleChange}
              placeholder="Apartamento, bloco, etc (opcional)"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
              error={!!errors.bairro}
              helperText={errors.bairro}
              required
              disabled={loadingCep}
              InputLabelProps={{ shrink: !!formData.bairro }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              error={!!errors.cidade}
              helperText={errors.cidade}
              required
              disabled={loadingCep}
              InputLabelProps={{ shrink: !!formData.cidade }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              error={!!errors.estado}
              helperText={errors.estado}
              required
              disabled={loadingCep}
              InputLabelProps={{ shrink: !!formData.estado }}
            />
          </Grid>

          {/* Informações de Frete */}
          {shippingInfo && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Alert
                icon={<LocalShipping />}
                severity={shippingInfo.freeShipping ? 'success' : 'info'}
                sx={{ mb: 2 }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {shippingInfo.message}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {shippingInfo.freeShipping ? (
                    'Frete Grátis!'
                  ) : (
                    <>Valor do frete: R$ {shippingInfo.cost.toFixed(2)}</>
                  )}
                </Typography>
                {shippingInfo.estimatedDays && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Entrega estimada: {shippingInfo.estimatedDays} dia{shippingInfo.estimatedDays !== 1 ? 's' : ''} úteis
                  </Typography>
                )}
              </Alert>
            </Grid>
          )}

          {/* Botão de submissão */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCart />}
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              {loading ? 'Finalizando Pedido...' : 'Finalizar Pedido'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CheckoutForm;
