import logger from "../service/log.service.js";
import { db } from "../util/db.util.js";

const addPayment = async function (req, res) {
  try {
    await db.query(`start transaction`);
    await db.query(`set autocommit = 0`);
    await db.query(`savepoint paymentSavePoint`);

    const { order_id, transaction_id, mode, total_amount } = req.body;
    const customer_id = req.userId;

    // if existing payments
    const [existing_payment] = await db.execute(
      `select id from payments where order_id = ?`,
      [order_id],
    );

    if (existing_payment.length > 0) {
      logger.error(` payment record exists for order id ${order_id} `);
      return res.status(400).json({ message: " payment record exists " });
    }

    //   validating user input (order_id and total amount)
    const [order_row] = await db.execute(
      `select total_amount, id from orders where id = ? and customer_id = ?`,
      [order_id, customer_id],
    );

    if (order_row.length == 0) {
      logger.error(`order not found with id ${order_id}`);
      return res.status(400).json({ message: " order not found " });
    }

    const total_order_amount = order_row[0].total_amount;

    if (total_amount != total_order_amount) {
      logger.error(
        `total amount not matched...user input ${total_amount} and db amount ${total_order_amount} not same`,
      );
      return res.status(400).json({ message: " total amount not matched " });
    }

    if (order_id != order_row[0].id) {
      logger.error(
        `id not matched...user input ${order_id} and db id ${order_row[0].id} not same`,
      );
      return res.status(400).json({ message: " id not matched " });
    }

    const [payments_row] = await db.execute(
      `insert into payments(order_id, transaction_id, mode, total_amount, customer_id) values (?, ?, ?, ?, ?)`,
      [order_id, transaction_id, mode, total_amount, customer_id],
    );

    const payment_id = payments_row.insertId;
    logger.info("payment created with id " + payment_id);

    const [order_items_arr] = await db.execute(
      `select * from order_items where order_id = ?`,
      [order_id],
    );

    for (const item of order_items_arr) {
      const commission_charged = item.total_amount * 0.002; // 0.2% commission
      const vendor_amount = item.total_amount - commission_charged;
      // vendor_amount is the amount goes to vendor after deducting commission

      // splitting the payments
      const [row] = await db.execute(
        `insert into payment_splits (payment_id, vendor_id, order_item_id, commission_charged, vendor_amount) values (?, ?, ?, ?, ?)`,
        [
          payment_id,
          item.vendor_id,
          item.id,
          commission_charged,
          vendor_amount,
        ],
      );
      console.log(row, " payment split ");
    } // for end

    logger.info("payment splitted ");

    const [payment_track] = await db.execute(
      `insert into payment_tracks 
      (payment_id, status) values(?, ?)`,
      [payment_id, "pending"],
    );

    logger.info(" tracking added on payments ");
    console.log(payment_track, " tracking added on payments");

    await db.query(`commit`);
    return res.status(200).json({ message: "paymen added successfully" });
  } catch (error) {
    await db.query(`rollback to paymentSavePoint`);
    console.log(error);
    logger.error("Error inside addPayment " + error.message);
    return res.status(500).json({ message: " internal server error " });
  }
};
const getPayment = async function (req, res) {
  try {
    const id = req.params.id;
    const [payment] = await db.execute(`select * from payments where id = ?`, [
      id,
    ]);

    if (payment.length == 0) {
      logger.info("no payment available with id " + id);
      return res
        .status(400)
        .json({ message: "no payment available with id " + id });
    }

    logger.info(` payment fetched successfully `);

    return res.status(200).json(payment);
  } catch (error) {
    console.log(error);
    logger.error("Error inside addPayment " + error.message);
    return res.status(500).json({ message: " internal server error " });
  }
};

export { getPayment, addPayment };
