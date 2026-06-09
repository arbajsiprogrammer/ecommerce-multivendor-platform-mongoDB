import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import mongoose from "mongoose";

// add item to order
const addItemToOrder = async (req, res) => {
  try {
    // stated transaction
    const session = await mongoose.startSession();
    // rollback point
    session.startTransaction();

    const customerId = req.user._id;
    const { cartId } = req.body;

    //  Validate cart items

    const existingCart = await mdb
      .collection("carts")
      .findOne({ _id: new ObjectId(cartId), customerId });

    if (!existingCart) {
      logger.error(
        `Cart with id ${cartId} not found for customer id ${customerId}`,
      );

      return res.status(404).json({ message: "Cart not found" });
    }

    // fetching cart items
    const cartItems = existingCart.cartItems;

    if (cartItems.length == 0) {
      logger.error(
        `Cart with id ${cartId} is empty for customer id ${customerId}`,
      );

      return res.status(400).json({ message: "Cart is empty" });
    }

    // calculating total amount
    let totalAmount = 0;
    let deliveryCharges = 0;
    const orderItemArray = [];

    for (const item of cartItems) {
      console.log("cart item");
      console.log(item);

      const productSkuId = item.productSkuId;
      console.log("productSkuId");
      console.log(productSkuId);
      const productId = item.productId;

      const product = await mdb
        .collection("products")
        .findOne({ _id: new ObjectId(productId) });
      const vendorId = product.vendorId;

      const productSku = product.productSkuses.filter(
        (sku) => sku.id == productSkuId,
      )[0];

      if (!productSku) {
        session.abortTransaction();
        return res.status(404).json({ message: "Product SKU not found" });
      }

      const price = productSku.price;

      totalAmount += item.quantity * price;
      // Calculating delivery charges
      deliveryCharges = 0;

      if (totalAmount < 1000) {
        deliveryCharges = 50;
      } else {
        deliveryCharges = 0;
      }
      // creating order item
      const orderItem = {
        id: item.id || Date.now().toString(),
        vendorId,
        productId,
        productSkusId: productSkuId,
        quantity: item.quantity,
        skuPriceSnapshot: productSku.price,
        productNameSnapshot: product.productName,
        totalAmount: productSku.price * item.quantity,
      };
      orderItemArray.push(orderItem);
    }

    // order tracking
    const orderTracksArray = [];
    // creating first default track
    const orderTrack = {
      id: Date.now().toString(),
      orderStatus: "CONFIRMED",
      remarks: "order confirmed",
    };
    orderTracksArray.push(orderTrack);
    // creating order
    const order = {
      customerId,
      totalAmount,
      deliveryCharges,
      orderItems: orderItemArray,
      orderTracks: orderTracksArray,
    };

    const response = await mdb.collection("orders").insertOne(order);
    console.log("response");
    console.log(response);

    // deleting the cart
    const deleteCartResponse = await mdb
      .collection("carts")
      .deleteOne({ _id: new ObjectId(cartId), customerId });
    console.log("deleteCartResponse");
    console.log(deleteCartResponse);
    // await db.execute(`commit`);
    session.commitTransaction();

    return res
      .status(200)
      .json({ message: "Order created successfully", response });
  } catch (error) {
    logger.error(`Error in addItemToOrder: ${error.message}`);
    console.error("Error in addItemToOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all orders
const getAllOrders = async (req, res) => {
  try {
    const customerId = req.user._id;
    const role = req.user.role;

    const orders = await mdb.collection("orders").find({}).toArray();

    console.log(orders, " all orders for customer id inside getAllOrders");

    if (orders.length == 0) {
      logger.error(`No orders found for customer id ${customerId}`);
      return res.status(400).json({ message: "No orders found " });
    }

    logger.info(`Orders retrieved successfully for customer id ${customerId}`);

    return res.status(200).json({ orders: orders });
  } catch (error) {
    logger.error(`Error in getAllOrders: ${error.message}`);
    console.log("Error in getAllOrders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get order
const getOrder = async (req, res) => {
  try {
    const customerId = req.user._id;
    const role = req.user.role;
    const orderId = req.params.id;

    const order = await mdb
      .collection("orders")
      .findOne({ _id: new ObjectId(orderId) });
    console.log(order, " order details for order id inside getOrder");

    if (!order) {
      logger.error(
        `No order found with id ${orderId} for customer id ${customerId}`,
      );
      return res.status(400).json({ message: "No orders found " });
    }

    logger.info(
      `Order details retrieved successfully for order id ${orderId} and customer id ${customerId}`,
    );

    return res.status(200).json(order);
  } catch (error) {
    logger.error(`Error in getOrder: ${error.message}`);
    console.log("Error in getOrder:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

export { addItemToOrder, getAllOrders, getOrder };
