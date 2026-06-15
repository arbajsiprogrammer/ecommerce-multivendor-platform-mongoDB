import COLLECTION from "../Constants/collectionName.constant.js";
import {
  updateCartItemQuantity,
  removeCartItem,
  validateCartItem,
  validateCartItemExists,
  validateStock,
} from "../helper/cart.helper.js";
import { errorResponse } from "../helper/response.helper.js";
import {
  addItemToCartRepository,
  deleteCartItemRepository,
  getCart,
  getOrCreateCart,
  updateCartItemsRepository,
} from "../repository/cart.repository.js";
import { findOne } from "../repository/common.repository.js";
import { getSkuService } from "./sku.service.js";

const getExistingCart = async (customerId) => {
  const existingCart = await findOne(COLLECTION.CART, { customerId });

  return existingCart;
};

const validateAddToCart = async (productId, skuId) => {
  // check if product skus is available or not in the inventory
  const product = await findOne(COLLECTION.PRODUCT, {
    _id: new ObjectId(productId),
  });
  const productSku = product.productSkuses.filter((sku) => sku.id == skuId)[0];

  return productSku;
};

const addProductToCart = async (customerId, newCartItems) => {
  // add product sku
  const response = await mdb.collection(COLLECTION.CART).updateOne(
    { customerId },
    {
      $set: {
        cartItems: [...newCartItems],
      },
    },
  );
  return response;
};

const getCartProductService = async (customerId, cartItemId = null) => {
  const cart = await getExistingCart(customerId);

  if (cartItemId) {
    const cartItem = cart.cartItems.filter((item) => item.id == cartItemId);
    return cartItem;
  }
  return cart;
};

const addToCartService = async (user, body, params) => {
  const customerId = user._id;

  const { productSkuId, quantity, id = crypto.randomUUID() } = body;

  const { productId, skuId } = params;

  const cart = await getOrCreateCart(customerId);

  const productSku = await getSkuService(productId, productSkuId);

  validateCartItem(cart, productSku, quantity);

  const cartItem = {
    id,
    productId,
    productSkuId,
    quantity,
  };

  cart.cartItems.push(cartItem);
  const response = await addItemToCartRepository(customerId, cart.cartItems);
  return response;
};

const updateCartItemService = async (user, params, body) => {
  const customerId = user._id;
  const { cartItemId } = params;
  const { productId, productSkuId, quantity } = body;

  const cart = await getExistingCart(customerId);

  const productSku = await getSkuService(productId, productSkuId);

  validateStock(productSku, quantity);

  const updatedCartItems = updateCartItemQuantity(
    cart.cartItems,
    cartItemId,
    quantity,
  );

  const response = await updateCartItemsRepository(
    customerId,
    updatedCartItems,
  );
  return response;
};

const deleteCartItemService = async (user, params) => {
  const customerId = user._id;
  const { cartItemId } = params;

  const cart = await getExistingCart(customerId);

  const existingItem = validateCartItemExists(cart, cartItemId);

  const updatedCartItems = await removeCartItem(cart.cartItems, cartItemId);
  const response = await deleteCartItemRepository(customerId, updatedCartItems);
  return response;
};

export {
  getExistingCart,
  validateAddToCart,
  addProductToCart,
  getCartProductService,
  addToCartService,
  updateCartItemService,
  deleteCartItemService,
};
