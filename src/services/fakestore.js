import axios from 'axios';

// Configuração da FakeStore API
const FAKESTORE_URL = import.meta.env.VITE_FAKESTORE_URL || 'https://fakestoreapi.com';

const fakestoreApi = axios.create({
  baseURL: FAKESTORE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging (desenvolvimento)
fakestoreApi.interceptors.request.use(
  (config) => {
    console.log(`[FakeStore Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[FakeStore Request Error]', error);
    return Promise.reject(error);
  }
);

fakestoreApi.interceptors.response.use(
  (response) => {
    console.log(`[FakeStore Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[FakeStore Response Error]', error.message);
    return Promise.reject(error);
  }
);

/**
 * GET - Buscar todos os produtos
 */
export const getAllProducts = async () => {
  try {
    const response = await fakestoreApi.get('/products');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar produtos da FakeStore API');
  }
};

/**
 * GET - Buscar produto específico por ID
 */
export const getProductById = async (productId) => {
  try {
    const response = await fakestoreApi.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar produto');
  }
};

/**
 * GET - Buscar todas as categorias disponíveis
 */
export const getCategories = async () => {
  try {
    const response = await fakestoreApi.get('/products/categories');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar categorias');
  }
};

/**
 * GET - Buscar produtos por categoria
 */
export const getProductsByCategory = async (category) => {
  try {
    const response = await fakestoreApi.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar produtos da categoria');
  }
};

export default fakestoreApi;
