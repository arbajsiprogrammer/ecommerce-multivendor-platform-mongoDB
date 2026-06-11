// getting all cart products

import { Logger } from "winston";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";

// GET cart items of a cart
const getCartProducts = async function (req, res) {
  try {
    const customerId = req.user._id;
    console.log(customerId);
    const cartItems = await mdb
      .collection(COLLECTION.CART)
      .find({ customerId })
      .toArray();

    console.log("cartItems");
    console.log(cartItems);

    logger.info(`Cart products fetched for customer id ${customerId}`);
    return res.status(200).json({ cartItems });
  } catch (error) {
    logger.error(
      `Error fetching cart products for customer id ${customerId}: ${error}`,
    );
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

// get single cart item
const getCartItem = async function (req, res) {
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

    return res.status(200).json({ cartItem });
  } catch (error) {
    logger.error(`Error fetching cart item : ${error}`);
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

// add to cart
const addToCart = async function (req, res) {
  try {
    const customerId = req.user._id;

    const cartItemId = req.body?.id || Date.now().toString();
    const { productSkuId, quantity } = req.body;

    const productId = req.params.productId;
    const skuId = req.params.skuId;

    let existingCart = await mdb
      .collection(COLLECTION.CART)
      .findOne({ customerId });

    console.log(existingCart, " existingCart inside add to cart");

    // every customer have only one cart
    // if cart not exist
    if (!existingCart) {
      logger.info(`Cart created for customer id ${customerId}`);
      existingCart = await mdb
        .collection(COLLECTION.CART)
        .insertOne({ customerId, cartItems: [] });
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
      (sku) => sku.id == skuId,
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

    // if current product sku is already exist
    let existingProductSku;
    if (existingCart.cartItems && existingCart.cartItems.length > 0) {
      existingProductSku = existingCart.cartItems.filter(
        (item) => item.productSkusId == skuId,
      );
      console.log("**************existingProductSku****************");
      console.log(existingProductSku);
    }

    if (existingProductSku && existingProductSku.length > 0) {
      logger.warn(
        `Product with SKU id ${productSkuId} is already in cart for customer id ${customerId}`,
      );
      return res.status(400).json({ message: "Product is already in cart" });
    }

    const newCartItems = [
      ...existingCart.cartItems,
      { id: cartItemId, productId, productSkuId, quantity },
    ];
    console.log("newCartItems");
    console.log(newCartItems);

    // add product sku
    const response = await mdb.collection(COLLECTION.CART).updateOne(
      { customerId },
      {
        $set: {
          cartItems: [...newCartItems],
        },
      },
    );

    logger.info(`Product added to cart `);
    console.log(await mdb.collection(COLLECTION.CART).findOne({ customerId }));

    return res.status(200).json({ message: "Product added to cart", response });
  } catch (error) {
    logger.error(`Error adding product to cart: ${error}`);
    console.log(error);
    return res.status(500).json({ message: error });
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
    logger.error(`Error updating cart item: ${error}`);
    console.log(error);
    return res.status(500).json({ message: error });
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
    logger.error(`Error deleting cart item: ${error}`);
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

export {
  getCartProducts,
  updateCartItems,
  deleteCartItems,
  getCartItem,
  addToCart,
};
