// getting all cart products

import { Logger } from "winston";
import logger from "../service/log.service.js";
import { db } from "../util/db.util.js";

// GET cart products
const getCartProducts = async function (req, res) {
  try {
    const customerId = req.user.id;
    console.log(customerId);
    const [row] = await db.execute(
      `select * from cart_items where cart_id = (select id from carts where customer_id = ${customerId}) `,
    );
    logger.info(`Cart products fetched for customer id ${customerId}`);
    return res.status(200).json({ cartItems: row });
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
    const customerId = req.user.id;
    const cart_item_id = req.params.id;

    const [existing_cart_item] = await db.execute(
      `select * from cart_items where id = ${cart_item_id}`,
    );
    if (existing_cart_item.length == 0) {
      logger.warn(
        `Cart item with id ${cart_item_id} not found for customer id ${customerId}`,
      );
      return res.status(400).json({ message: "Cart item not found" });
    }
    logger.info(
      `Cart item with id ${cart_item_id} fetched for customer id ${customerId}`,
    );
    return res.status(200).json({ cartItem: existing_cart_item });
  } catch (error) {
    logger.error(
      `Error fetching cart item with id ${cart_item_id} for customer id ${customerId}: ${error}`,
    );
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

// add to cart
const addToCart = async function (req, res) {
  try {
    const customerId = req.user.id;
    const { product_sku_id, quantity } = req.body;

    let [cart] = await db.execute(
      `select id from carts where customer_id = ${customerId}`,
    );
    console.log(cart, " cart id inside add to cart");
    // every customer have only one cart
    // if cart not exist
    if (cart.length == 0) {
      logger.info(`Cart created for customer id ${customerId}`);
      [cart] = await db.execute(
        `insert into carts (customer_id) values (${customerId})`,
      );
    }

    // check if product skus is available or not in the inventory
    const [product_sku] = await db.execute(
      `select * from product_skus where id = ${product_sku_id}`,
    );

    if (product_sku.length == 0) {
      logger.warn(
        `Product with SKU id ${product_sku_id} not found for customer id ${customerId}`,
      );
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      product_sku[0].current_stock < quantity ||
      !product_sku[0].availability_status
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
    const [existing_product_sku] = await db.execute(
      `select * from cart_items where cart_id = ${cart[0].id} and product_skus_id = ${product_sku_id}`,
    );

    if (existing_product_sku.length > 0) {
      logger.warn(
        `Product with SKU id ${product_sku_id} is already in cart for customer id ${customerId}`,
      );
      return res.status(400).json({ message: "Product is already in cart" });
    }

    // add product sku
    const [row] = await db.execute(
      `insert into cart_items (cart_id, product_skus_id, quantity) values (?, ?, ?)`,
      [cart[0].id, product_sku_id, quantity],
    );

    logger.info(`Product added to cart `);
    return res.status(200).json({ message: "Product added to cart", row });
  } catch (error) {
    logger.error(`Error adding product to cart: ${error}`);
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

// update cart item
const updateCartItems = async function (req, res) {
  try {
    const customerId = req.user.id;
    const cart_item_id = req.params.id;
    const { product_skus_id, quantity, cart_id } = req.body;

    let [cart] = await db.execute(
      `select * from carts where id = ${cart_id} and customer_id = ${customerId}`,
    );
    console.log(cart, " cart id inside update cart");
    // every customer have only one cart
    // if cart not exist
    if (cart.length == 0) {
      logger.warn(`Cart not found for customer id ${customerId}`);
      return res.status(404).json({ message: "Cart not found" });
    }

    // check if product skus is available or not in the inventory
    const [product_sku] = await db.execute(
      `select * from product_skus where id = ${product_skus_id}`,
    );

    if (product_sku.length == 0) {
      logger.warn(`Product not found`);
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      product_sku[0].current_stock < quantity ||
      !product_sku[0].availability_status
    ) {
      logger.warn(
        `Product is out of stock or quantity is greater than available stock`,
      );
      return res.status(400).json({
        message:
          "Product is out of stock or quantity is grater than available stock ",
      });
    }

    // if current product sku is already exist
    const [existing_product_sku] = await db.execute(
      `select * from cart_items where cart_id = ${cart[0].id} and product_skus_id = ${product_skus_id}`,
    );

    if (existing_product_sku.length == 0) {
      logger.warn(
        `Product with SKU id ${product_skus_id} not found in cart for customer id ${customerId}`,
      );
      return res.status(400).json({ message: "Product not found in cart" });
    }

    // update product sku quantity
    const [row] = await db.execute(
      `update cart_items set quantity = ? where cart_id = ? and product_skus_id = ?`,
      [quantity, cart_item_id, product_skus_id],
    );
    logger.info(`Cart item updated for customer id ${customerId}`);
    return res.status(200).json({ message: "Product updated", row });
  } catch (error) {
    logger.error(`Error updating cart item: ${error}`);
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

// DELETE cart item
const deleteCartItems = async function (req, res) {
  try {
    const customerId = req.user.id;
    const { cart_item_id } = req.body;

    const [existing_cart_item] = await db.execute(
      `select * from cart_items where id = ${cart_item_id}`,
    );
    if (existing_cart_item.length == 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const [row] = await db.execute(
      `delete from cart_items where id = ${cart_item_id}`,
    );
    logger.info(
      `Cart item with id ${cart_item_id} deleted for customer id ${customerId}`,
    );
    return res.status(200).json({ message: "Cart item deleted", row });
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
