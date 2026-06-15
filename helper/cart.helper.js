const validateCartItem = (cart, productSku, quantity) => {
  validateStock(productSku, quantity);

  validateSkuNotInCart(cart, productSku.id);

  return true;
};

const validateStock = (productSku, quantity) => {
  if (!productSku.availabilityStatus || productSku.availableStock < quantity) {
    throw new Error("Insufficient stock available");
  }
};

const validateSkuNotInCart = (cart, skuId) => {
  const isExists = cart.cartItems?.some((item) => item.productSkuId == skuId);

  if (isExists) {
    throw new Error("Product already exists in cart");
  }
};

const updateCartItemQuantity = (cartItems, cartItemId, quantity) => {
  const updatedCartItems = cartItems.map((item) => {
    if (item.id == cartItemId) {
      return {
        ...item,
        quantity,
      };
    }

    return item;
  });

  return updatedCartItems;
};

const validateCartItemExists = (cart, cartItemId) => {
  const existingItem = cart.cartItems?.filter((item) => item.id == cartItemId);

  if (existingItem.length == 0) {
    throw new Error("Cart item not found");
  }

  return existingItem;
};

const removeCartItem = async (cartItems, cartItemId) => {
  console.log(cartItems, cartItemId);
  const updatedCartItems = cartItems.filter((item) => item.id != cartItemId);
  console.log(updatedCartItems, cartItemId);
  return updatedCartItems;
};
export {
  validateCartItem,
  validateStock,
  validateSkuNotInCart,
  updateCartItemQuantity,
  validateCartItemExists,
  removeCartItem,
};
