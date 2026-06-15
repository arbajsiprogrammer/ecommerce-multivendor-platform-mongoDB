import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";
import {
  deleteOne,
  findOne,
  insertOne,
  updateOne,
} from "./common.repository.js";

const getCart = async (customerId) => {
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
  return existingCart;
};

const getOrCreateCart = async (customerId) => {
  let cart = await mdb.collection(COLLECTION.CART).findOne({ customerId });

  if (!cart) {
    await insertOne(COLLECTION.CART, {
      customerId,
      cartItems: [],
    });

    cart = await findOne(COLLECTION.CART, { customerId });
  }

  return cart;
};

const addItemToCartRepository = async (customerId, cartItems) => {
  const response = await updateOne(
    COLLECTION.CART,
    { customerId },
    {
      cartItems: cartItems,
    },
  );

  return response;
};

const updateCartItemsRepository = async (customerId, cartItems) => {
  const response = await updateOne(
    COLLECTION.CART,
    { customerId },
    {
      cartItems,
    },
  );

  return response;
};

const deleteCartItemRepository = async (customerId, cartItems) => {
  const response = await updateOne(
    COLLECTION.CART,
    { customerId },
    { cartItems: cartItems },
  );
  return response;
};

export {
  getCart,
  getOrCreateCart,
  addItemToCartRepository,
  updateCartItemsRepository,
  deleteCartItemRepository,
};
