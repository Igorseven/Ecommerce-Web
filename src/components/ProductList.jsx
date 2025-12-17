import { Grid, Pagination, Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';

/**
 * Componente de lista de produtos com paginação
 */
const ProductList = ({ products, page, totalPages, onPageChange }) => {
  if (!products || products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Nenhum produto encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Grid de produtos */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* Paginação */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => onPageChange(value)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductList;
