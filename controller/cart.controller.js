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

// GET cart items of a cart
const getCartProducts = async function (req, res) {
  try {
    const customerId = req.user._id;

    const cartItems = await getCartProductService(customerId);
    console.log("cartItems", cartItems);
    successResponse(res, 200, "cart items fetched successfully", cartItems);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// get single cart item
const getCartItem = async function (req, res) {
  try {
    const customerId = req.user._id;
    const cartItemId = req.params.cartItemId;

    const cartItems = await getCartProductService(customerId, cartItemId);

    return res.status(200).json({ cartItems });
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// add to cart
const addToCart = async (req, res) => {
  try {
    const cart = await addToCartService(req.user, req.body, req.params);

    successResponse(res, 200, "Product added to cart", cart);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// update cart item
const updateCartItems = async (req, res) => {
  try {
    const response = await updateCartItemService(
      req.user,
      req.params,
      req.body,
    );

    successResponse(res, 200, "Cart item updated successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// delete cart item
const deleteCartItems = async (req, res) => {
  try {
    const response = await deleteCartItemService(req.user, req.params);

    successResponse(res, 200, "Cart item deleted successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

export {
  getCartProducts,
  updateCartItems,
  deleteCartItems,
  getCartItem,
  addToCart,
};
