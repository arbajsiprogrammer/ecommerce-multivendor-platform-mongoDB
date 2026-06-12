import mongoose from "mongoose";
import logger from "../service/log.service.js";
import { mdb, db } from "../util/db.util.js";
import { ObjectId } from "mongodb";
import { getAllPaymentsService } from "../service/payment.service.js";

const addPayment = async function (req, res) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { orderId, transactionId, mode, totalAmount, status } = req.body;
    const customerId = req.userId;

    const existingPayment = await mdb
      .collection(COLLECTION.PAYMENT)
      .findOne({ orderId });

    if (existingPayment) {
      logger.error(` payment record exists for order id ${orderId} `);
      return res.status(400).json({ message: " payment record exists " });
    }

    //   validating user input (orderId and total amount)
    const order = await mdb
      .collection(COLLECTION.ORDER)
      .findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      logger.error(`order not found with id ${orderId}`);
      return res.status(400).json({ message: " order not found " });
    }

    if (totalAmount != order.totalAmount) {
      logger.error(
        `total amount not matched...user input ${totalAmount} and db amount ${total_order_amount} not same`,
      );
      return res.status(400).json({ message: " total amount not matched " });
    }

    const paymentTrackArray = [];
    const paymentTrack = {
      id: Date.now().toString(),
      status: "pending",
    };
    paymentTrackArray.push(paymentTrack);

    // splitting the payment
    const paymentSplitsArray = [];
    for (const item of order.orderItems) {
      const commissionCharged = item.totalAmount * 0.002; // 0.2% commission
      const vendorAmount = item.totalAmount - commissionCharged;
      // vendorAmount is the amount goes to vendor after deducting commission

      // splitting the payments
      const paymentSplit = {
        id: Date.now().toString(),
        vendorId: item.vendorId,
        orderItemId: item._id,
        commissionCharged,
        vendorAmount,
      };
      paymentSplitsArray.push(paymentSplit);
      console.log(paymentSplit, " payment split ");
    } // for end

    logger.info("payment splitted ");

    logger.info(" tracking added on payments ");
    console.log(paymentTrack, " tracking added on payments");

    const payment = {
      orderId,
      transactionId,
      mode,
      totalAmount,
      status,
      paymentSplits: paymentSplitsArray,
      paymentTracks: paymentTrackArray,
    };

    const response = await mdb
      .collection(COLLECTION.PAYMENT)
      .insertOne(payment);
    const paymentId = response.insertId;
    logger.info("payment created with id " + response);

    session.commitTransaction();
    return res
      .status(200)
      .json({ message: "payment added successfully", response });
  } catch (error) {
    session.abortTransaction();
    console.log(error);
    logger.error("Error inside addPayment " + error.message);
    return res.status(500).json({ message: " internal server error " });
  } finally {
    session.endSession();
  }
};

const getPayment = async function (req, res) {
  try {
    const paymentId = req.params.paymentId;

    const payment = await mdb
      .collection(COLLECTION.PAYMENT)
      .findOne({ _id: new ObjectId(paymentId) });

    if (!payment) {
      logger.info(" no payment available with id " + paymentId);
      return res
        .status(400)
        .json({ message: "no payment available with id " + paymentId });
    }
    logger.info(` payment fetched successfully `);
    return res.status(200).json(payment);
  } catch (error) {
    console.log(error);
    logger.error("Error inside addPayment " + error.message);
    return res.status(500).json({ message: " internal server error " });
  }
};

// payments
const getAllPayments = async function (req, res) {
  try {
    const payments = await getAllPaymentsService();

    successResponse(res, 200, "payments data fetched", payments);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export { getPayment, addPayment, getAllPayments };
