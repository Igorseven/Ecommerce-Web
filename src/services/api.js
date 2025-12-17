import axios from 'axios';

// Configuração base da API do backend Flask
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de requisições (desenvolvimento)
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para logging de respostas (desenvolvimento)
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ========== ORDERS ENDPOINTS ==========

/**
 * GET - Listar todos os pedidos
 */
export const getOrders = async () => {
  try {
    const response = await api.get('/api/orders');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar pedidos');
  }
};

/**
 * GET - Buscar pedido específico por ID
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar pedido');
  }
};

/**
 * POST - Criar novo pedido
 * @param {Object} orderData - Dados do pedido
 * @param {string} orderData.customer_name - Nome do cliente
 * @param {string} orderData.customer_email - Email do cliente
 * @param {string} orderData.customer_phone - Telefone do cliente
 * @param {Object} orderData.address - Endereço de entrega
 * @param {Array} orderData.items - Lista de itens do pedido
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao criar pedido');
  }
};

/**
 * PUT - Atualizar pedido existente
 */
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await api.put(`/api/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar pedido');
  }
};

/**
 * DELETE - Deletar pedido
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao deletar pedido');
  }
};

// ========== CEP ENDPOINT ==========

/**
 * GET - Validar e buscar endereço por CEP (integrado com ViaCEP via backend)
 * @param {string} cep - CEP a ser validado
 * @param {boolean} calculateShipping - Se deve calcular o frete
 */
export const validateCep = async (cep, calculateShipping = false) => {
  try {
    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }

    const params = calculateShipping ? '?calculate_shipping=true' : '';
    const response = await api.get(`/api/cep/${cleanCep}${params}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao validar CEP');
  }
};

export default api;
