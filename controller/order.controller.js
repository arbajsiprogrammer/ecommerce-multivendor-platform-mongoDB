import logger from "../service/log.service.js";
import { db } from "../util/db.util.js";

// add item to order
const addItemToOrder = async (req, res) => {
  try {
    // stated transaction
    await db.query(`start transaction`);
    await db.query(`set autocommit = 0`);
    // rollback point
    await db.query(`savepoint orderStartPoint`);

    const customerId = req.user.id;
    const { cart_id } = req.body;

    //  Validate cart items
    const [existingCart] = await db.execute(
      "SELECT * FROM carts WHERE id = ? AND customer_id = ?",
      [cart_id, customerId],
    );

    if (existingCart.length == 0) {
      logger.error(
        `Cart with id ${cart_id} not found for customer id ${customerId}`,
      );

      return res.status(404).json({ message: "Cart not found" });
    }

    // fetching cart items
    const [cartItems] = await db.execute(
      "SELECT * FROM cart_items WHERE cart_id = ?",
      [cart_id],
    );

    if (cartItems.length == 0) {
      logger.error(
        `Cart with id ${cart_id} is empty for customer id ${customerId}`,
      );

      return res.status(400).json({ message: "Cart is empty" });
    }

    // calculating total amount
    let totalAmount = 0;
    for (const item of cartItems) {
      const [price_row] = await db.execute(
        "SELECT price FROM product_skus WHERE id = ?",
        [item.product_skus_id],
      );

      if (price_row.length == 0) {
        await db.execute(`rollback to orderStartPoint`);
        return res.status(404).json({ message: "Product SKU not found" });
      }

      const price = price_row[0].price;

      totalAmount += item.quantity * price;
    }

    // Calculating delivery charges
    let delivery_charges = 0;

    if (totalAmount < 1000) {
      delivery_charges = 50;
    } else {
      delivery_charges = 0;
    }

    // creating order
    const [row] = await db.execute(
      `insert into orders (customer_id, total_amount, delivery_charges) values (?, ?, ?)`,
      [customerId, totalAmount, delivery_charges],
    );

    console.log(row, " created order inside addItemToOrder ");

    const order_id = row.insertId;

    // creating order items for current order
    for (const item of cartItems) {
      // seller of the current order item
      // const [product_name_row] = await db.execute(
      //   `select  from products where id = (select product_id from product_skus where id = ?)`,
      //   [product_sku_row[0].id],
      // );
      const [vendor_row] = await db.execute(
        `select vendor_id, product_name from products where id = (select product_id from product_skus where id = ?)`,
        [item.product_skus_id],
      );
      console.log(vendor_row, " vendor row inside addItemToOrder");

      if (vendor_row.length == 0) {
        logger.error(
          `Vendor not found for product SKU id ${item.product_skus_id} in order id ${order_id}`,
        );
        await db.execute(`rollback to orderStartPoint`);
        return res.status(400).json({ message: "Vendor not found" });
      }

      const vendor_id = vendor_row[0].vendor_id;
      const product_name = vendor_row[0].product_name;

      console.log(vendor_id, " vendor id inside addItemToOrder");

      // pickup address and delivery address for current order item
      const [pickupAddressRow] = await db.execute(
        `select id from pickup_address where vendor_id = ?`,
        [vendor_id],
      );

      console.log(pickupAddressRow, " pickup address row ");
      if (pickupAddressRow.length == 0) {
        logger.error(
          `Pickup address not found for vendor id ${vendor_id} in order id ${order_id}`,
        );
        await db.execute(`rollback to orderStartPoint`);
        return res.status(404).json({ message: "Pickup address not found" });
      }

      const pickup_address_id = pickupAddressRow[0].id;
      console.log(
        pickup_address_id,
        " pickup address id inside addItemToOrder",
      );

      // delivery address
      const [deliveryAddressRow] = await db.execute(
        `select id from delivery_address where customer_id = ?`,
        [customerId],
      );
      console.log(deliveryAddressRow, " delivery address row ");

      if (deliveryAddressRow.length == 0) {
        logger.error(
          `Delivery address not found for customer id ${customerId} in order id ${order_id}`,
        );
        await db.execute(`rollback to orderStartPoint`);
        return res.status(404).json({ message: "Delivery address not found" });
      }
      const delivery_address_id = deliveryAddressRow[0].id;

      console.log(
        delivery_address_id,
        " delivery address id inside addItemToOrder",
      );

      const quantity = item.quantity;

      const [product_sku_row] = await db.execute(
        `select * from product_skus where id = ?`,
        [item.product_skus_id],
      );

      if (product_sku_row.length == 0) {
        logger.error(
          `Product SKU with id ${item.product_skus_id} not found for order id ${order_id}`,
        );
        await db.execute(`rollback to orderStartPoint`);
        return res.status(404).json({ message: "Product SKU not found" });
      }

      const price = product_sku_row[0].price;

      const amount = quantity * price;

      const [row] = await db.execute(
        `insert into order_items (vendor_id, pickup_address_id, delivery_address_id, order_id, quantity, total_amount, product_skus_id, product_name_snapshot, sku_price_snapshot) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vendor_id,
          pickup_address_id,
          delivery_address_id,
          order_id,
          quantity,
          amount,
          item.product_skus_id,
          product_name,
          price,
        ],
      );

      console.log(row, " order item inside addItemToOrder");
    }

    // add tracking on order
    const [tracking_row] = await db.execute(
      `insert into order_tracks (order_id, order_status, remarks) values(?, ?, ?)`,
      [order_id, "ORDER_PLACED", "Order created successfully"],
    );
    console.log(tracking_row, " order tracking row inside addItemToOrder");

    // making cart empty
    await db.execute(`delete from cart_items where cart_id = ?`, [cart_id]);

    logger.info(
      `Order with id ${order_id} created successfully for customer id ${customerId}`,
    );
    // await db.execute(`commit`);
    await db.query(`commit`);
    return res.status(200).json({ message: "Order created successfully" });
  } catch (error) {
    logger.error(`Error in addItemToOrder: ${error.message}`);
    console.error("Error in addItemToOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all orders
const getAllOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const role = req.user.role;

    const [orders] = await db.execute(
      `select id, customer_id, delivery_charges,total_amount from orders where customer_id = ?`,
      [customerId],
    );

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
    const customerId = req.user.id;
    const role = req.user.role;
    const orderId = req.params.id;

    const [order] = await db.execute(
      `select id, customer_id, total_amount, delivery_charges from orders where id = ? and customer_id = ?`,
      [orderId, customerId],
    );

    console.log(order, " order details for order id inside getOrder");

    if (order.length == 0) {
      logger.error(
        `No order found with id ${orderId} for customer id ${customerId}`,
      );
      return res.status(400).json({ message: "No orders found " });
    }

    logger.info(
      `Order details retrieved successfully for order id ${orderId} and customer id ${customerId}`,
    );

    return res.status(200).json({ order: order });
  } catch (error) {
    logger.error(`Error in getOrder: ${error.message}`);
    console.log("Error in getOrder:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

export { addItemToOrder, getAllOrders, getOrder };
