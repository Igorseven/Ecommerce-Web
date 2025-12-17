import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { AddShoppingCart, Add, Remove } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

/**
 * Componente de Card individual de produto
 */
const ProductCard = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity, incrementQuantity, decrementQuantity } = useCart();

  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const handleIncrement = () => {
    incrementQuantity(product.id);
    toast.info('Quantidade atualizada!', {
      position: 'bottom-right',
      autoClose: 1000,
    });
  };

  const handleDecrement = () => {
    decrementQuantity(product.id);
    if (quantity > 1) {
      toast.info('Quantidade atualizada!', {
        position: 'bottom-right',
        autoClose: 1000,
      });
    } else {
      toast.warning('Produto removido do carrinho!', {
        position: 'bottom-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {/* Imagem do produto */}
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.title}
        sx={{
          objectFit: 'contain',
          padding: 2,
          backgroundColor: '#f9f9f9',
        }}
      />

      {/* Conteúdo do card */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Categoria */}
        <Chip
          label={product.category}
          size="small"
          color="primary"
          sx={{ mb: 1, textTransform: 'capitalize' }}
        />

        {/* Título do produto */}
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3em',
          }}
        >
          {product.title}
        </Typography>

        {/* Descrição resumida */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {product.description}
        </Typography>

        {/* Avaliação */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            ⭐ {product.rating?.rate || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({product.rating?.count || 0} avaliações)
          </Typography>
        </Box>

        {/* Preço */}
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>

      {/* Ações do card */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        {!inCart ? (
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddShoppingCart />}
            onClick={handleAddToCart}
            sx={{
              fontWeight: 'bold',
              py: 1,
            }}
          >
            Adicionar ao Carrinho
          </Button>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: 1,
            }}
          >
            <IconButton
              color="primary"
              onClick={handleDecrement}
              size="small"
              sx={{ border: '1px solid', borderColor: 'primary.main' }}
            >
              <Remove />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
              {quantity}
            </Typography>
            <IconButton
              color="primary"
              onClick={handleIncrement}
              size="small"
              sx={{ border: '1px solid', borderColor: 'primary.main' }}
            >
              <Add />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
