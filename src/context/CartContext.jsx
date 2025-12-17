import { createContext, useState, useContext, useEffect } from 'react';

// Criação do Context
const CartContext = createContext();

// Hook customizado para usar o contexto do carrinho
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

// Provider do carrinho
export const CartProvider = ({ children }) => {
  // Estado do carrinho - persistido no localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('ecommerce_cart');
      return savedCart ? JSON.parse(savedCart) : { items: [] };
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
      return { items: [] };
    }
  });

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [cart]);

  /**
   * Adicionar produto ao carrinho
   * Se o produto já existe, incrementa a quantidade
   */
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.product_id === product.id
      );

      if (existingItemIndex !== -1) {
        // Produto já existe no carrinho - incrementa quantidade
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { items: updatedItems };
      } else {
        // Novo produto - adiciona ao carrinho
        const newItem = {
          product_id: product.id,
          product_name: product.title,
          product_image: product.image,
          unit_price: product.price,
          quantity: 1,
        };
        return { items: [...prevCart.items, newItem] };
      }
    });
  };

  /**
   * Remover produto do carrinho completamente
   */
  const removeFromCart = (productId) => {
    setCart((prevCart) => ({
      items: prevCart.items.filter((item) => item.product_id !== productId),
    }));
  };

  /**
   * Atualizar quantidade de um produto específico
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => ({
      items: prevCart.items.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ),
    }));
  };

  /**
   * Incrementar quantidade de um produto
   */
  const incrementQuantity = (productId) => {
    setCart((prevCart) => ({
      items: prevCart.items.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }));
  };

  /**
   * Decrementar quantidade de um produto
   * Se chegar a 0, remove o produto
   */
  const decrementQuantity = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.items.find((i) => i.product_id === productId);
      if (!item) return prevCart;

      if (item.quantity <= 1) {
        return {
          items: prevCart.items.filter((i) => i.product_id !== productId),
        };
      }

      return {
        items: prevCart.items.map((i) =>
          i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  };

  /**
   * Limpar carrinho completamente
   */
  const clearCart = () => {
    setCart({ items: [] });
  };

  /**
   * Calcular total de itens no carrinho
   */
  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Calcular preço total do carrinho
   */
  const getTotalPrice = () => {
    return cart.items.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0
    );
  };

  /**
   * Verificar se produto está no carrinho
   */
  const isInCart = (productId) => {
    return cart.items.some((item) => item.product_id === productId);
  };

  /**
   * Obter quantidade de um produto específico no carrinho
   */
  const getItemQuantity = (productId) => {
    const item = cart.items.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  // Valor do contexto que será disponibilizado
  const contextValue = {
    cart,
    items: cart.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
