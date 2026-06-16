import mongoose from "mongoose";
import COLLECTION from "../Constants/collectionName.constant.js";
import { find } from "../repository/common.repository.js";
import {
  createPaymentSplits,
  createPaymentTracks,
} from "../helper/payment.helper.js";
import { getOrderById } from "../repository/review.repository.js";
import {
  createPaymentRepository,
  getPaymentByOrderId,
  getPaymentRepository,
} from "../repository/payment.repository.js";
import { ApiError } from "../util/ApiError.util.js";

const getAllPaymentsService = async () => {
  const response = await find(COLLECTION.PAYMENT, {});
  return response;
};

const addPaymentService = async (customerId, body) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { orderId, transactionId, mode, totalAmount, status } = body;

    await validatePayment(orderId, totalAmount);

    const order = await getOrderById(orderId);

    const paymentSplits = createPaymentSplits(order.orderItems);

    const paymentTracks = createPaymentTracks();

    const payment = {
      orderId,
      transactionId,
      mode,
      totalAmount,
      status,
      paymentSplits,
      paymentTracks,
    };

    const response = await createPaymentRepository(payment, session);

    await session.commitTransaction();

    return response;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const validatePayment = async (orderId, totalAmount) => {
  await getPaymentByOrderId(orderId);

  const order = await getOrderById(orderId);

  if (totalAmount != order.totalAmount) {
    throw new ApiError(400, "Total amount mismatch");
  }

  return order;
};

const getPaymentService = async (paymentId) => {
  const payment = await getPaymentRepository(paymentId);

  if (!payment) {
    throw new ApiError(400, "Payment not found");
  }

  return payment;
};
export { getAllPaymentsService, addPaymentService, getPaymentService };
