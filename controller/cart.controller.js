// getting all cart products

import { Logger } from "winston";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import {
  addProductToCart,
  getExistingCart,
  validateAddToCart,
} from "../service/cart.service.js";

// GET cart items of a cart
const getCartProducts = async function (req, res) {
  try {
    const customerId = req.user._id;

    const cartItems = await getExistingCart(customerId);

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

    const existingCart = await getExistingCart(customerId);

    const cartItem = existingCart.cartItems.filter(
      (item) => item.id == cartItemId,
    );

    return res.status(200).json({ cartItem });
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// add to cart
const addToCart = async function (req, res) {
  try {
    const customerId = req.user._id;

    const cartItemId = req.body?.id || crypto.randomUUID();
    const { productSkuId, quantity } = req.body;

    const productId = req.params.productId;
    const skuId = req.params.skuId;

    let existingCart = await mdb
      .collection(COLLECTION.CART)
      .findOne({ customerId });

    // every customer have only one cart
    // if cart not exist
    if (!existingCart) {
      logger.info(`Cart created for customer id ${customerId}`);
      existingCart = await mdb
        .collection(COLLECTION.CART)
        .insertOne({ customerId, cartItems: [] });
    }

    // validate add to cart
    await validateAddToCart(productId);

    // add product sku to cart
    const newCartItems = [
      ...existingCart.cartItems,
      { id: cartItemId, productId, productSkuId, quantity },
    ];
    const response = await addProductToCart(customerId, newCartItems);

    successResponse(res, 200, "Product added to cart", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// update cart item
const updateCartItems = async function (req, res) {
  try {
    const customerId = req.user._id;
    const cartItemId = req.params.cartItemId;
    const { productId, productSkuId, quantity } = req.body;

    const cart = await mdb.collection(COLLECTION.CART).findOne({ customerId });
    console.log(" cart id inside update cart ");
    console.log(cart);

    const cartItems = cart?.cartItems;
    console.log("cartItems");
    console.log(cartItems);

    // every customer have only one cart
    // if cart not exist
    if (!cart) {
      logger.warn(`Cart not found for customer id ${customerId}`);
      return res.status(404).json({ message: "Cart not found" });
    }

    // check if product skus is available or not in the inventory
    const product = await mdb
      .collection(COLLECTION.PRODUCT)
      .findOne({ _id: new ObjectId(productId) });
    console.log("product");
    console.log(product);

    if (!product) {
      logger.warn(
        `Product with  id ${productId} not found for customer id ${customerId}`,
      );
      return res.status(404).json({ message: "Product not found" });
    }

    const productSku = product.productSkuses.filter(
      (sku) => sku.id == productSkuId,
    )[0];
    console.log("productSku");
    console.log(productSku);
    // check if quantity is grater than the available stock or if product is out of stock
    if (
      productSku.availableStock < quantity ||
      !productSku.availabilityStatus
    ) {
      logger.warn(
        `Product  is out of stock or quantity is greater than available stock`,
      );
      return res.status(400).json({
        message:
          "Product is out of stock or quantity is grater than available stock ",
      });
    }

    const newCartItems = cartItems.map((item) => {
      if (item.id == cartItemId) {
        const newItem = { ...item, quantity: quantity };
        return newItem;
      } else {
        return item;
      }
    });

    // update the cart Items
    const response = await mdb.collection(COLLECTION.CART).updateOne(
      { customerId },
      {
        $set: { cartItems: newCartItems },
      },
    );

    logger.info(`Cart item updated for customer id ${customerId}`);
    return res.status(200).json({ message: "Product updated", response });
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// DELETE cart item
const deleteCartItems = async function (req, res) {
  try {
    const customerId = req.user._id;
    const cartItemId = req.params.cartItemId;

    const existingCart = await mdb
      .collection(COLLECTION.CART)
      .findOne({ customerId });

    if (!existingCart) {
      logger.warn(
        `Cart item with id ${cartItemId} not found for customer id ${customerId}`,
      );

      return res.status(400).json({ message: "Cart item not found" });
    }

    logger.info(
      `Cart item with id ${cartItemId} fetched for customer id ${customerId}`,
    );

    const cartItem = existingCart.cartItems.filter(
      (item) => item.id == cartItemId,
    );

    const cartItems = existingCart.cartItems.filter(
      (item) => item.id != cartItemId,
    );

    const response = await mdb.collection(COLLECTION.CART).updateOne(
      { customerId },
      {
        $set: { cartItems: cartItems },
      },
    );

    return res.status(200).json(response);
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
