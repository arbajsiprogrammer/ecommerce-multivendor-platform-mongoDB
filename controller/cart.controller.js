// getting all cart products

import { Logger } from "winston";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import {
  addProductToCart,
  addToCartService,
  deleteCartItemService,
  getCartProductService,
  getExistingCart,
  updateCartItemService,
  validateAddToCart,
} from "../service/cart.service.js";
import { asyncHandler } from "../util/asyncHandler.util.js";

// GET cart items of a cart
const getCartProducts = asyncHandler(async function (req, res) {
  const customerId = req.user._id;

  const cartItems = await getCartProductService(customerId);
  console.log("cartItems", cartItems);
  successResponse(res, 200, "cart items fetched successfully", cartItems);
});

// get single cart item
const getCartItem = asyncHandler(async function (req, res) {
  const customerId = req.user._id;
  const cartItemId = req.params.cartItemId;

  const cartItems = await getCartProductService(customerId, cartItemId);

  return res.status(200).json({ cartItems });
});

// add to cart
const addToCart = asyncHandler(async (req, res) => {
  const cart = await addToCartService(req.user, req.body, req.params);

  successResponse(res, 200, "Product added to cart", cart);
});

// update cart item
const updateCartItems = asyncHandler(async (req, res) => {
  const response = await updateCartItemService(req.user, req.params, req.body);

  successResponse(res, 200, "Cart item updated successfully", response);
});

// delete cart item
const deleteCartItems = asyncHandler(async (req, res) => {
  const response = await deleteCartItemService(req.user, req.params);

  successResponse(res, 200, "Cart item deleted successfully", response);
});

export {
  getCartProducts,
  updateCartItems,
  deleteCartItems,
  getCartItem,
  addToCart,
};
