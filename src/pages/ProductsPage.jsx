import { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, TextField, MenuItem } from '@mui/material';
import { getAllProducts, getCategories } from '../services/fakestore';
import ProductList from '../components/ProductList';
import Loading from '../components/Loading';

/**
 * Página principal - Listagem de produtos da FakeStore API
 */
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para paginação e filtros
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const productsPerPage = 9; // 9 produtos por página (3 colunas x 3 linhas)

  // Buscar produtos e categorias ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Buscar produtos e categorias em paralelo
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getCategories(),
        ]);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Erro ao carregar produtos. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aplicar filtros sempre que mudarem
  useEffect(() => {
    let filtered = [...products];

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setPage(1); // Resetar para primeira página ao filtrar
  }, [selectedCategory, searchTerm, products]);

  // Calcular produtos da página atual
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loading message="Carregando produtos..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Catálogo de Produtos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore nossos produtos e adicione ao carrinho para fazer seu pedido
        </Typography>
      </Box>

      {/* Filtros */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Campo de busca */}
        <TextField
          label="Buscar produtos"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 250 }}
          placeholder="Digite o nome do produto..."
        />

        {/* Filtro de categoria */}
        <TextField
          select
          label="Categoria"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Todas as Categorias</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category} sx={{ textTransform: 'capitalize' }}>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Contador de produtos */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Mostrando {currentProducts.length} de {filteredProducts.length} produtos
        </Typography>
      </Box>

      {/* Lista de produtos */}
      <ProductList
        products={currentProducts}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default ProductsPage;
