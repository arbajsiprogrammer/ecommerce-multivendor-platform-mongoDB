import mongoose from "mongoose";
import logger from "../service/log.service.js";
import { mdb, db } from "../util/db.util.js";
import { ObjectId } from "mongodb";
import {
  addPaymentService,
  getAllPaymentsService,
  getPaymentService,
} from "../service/payment.service.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
const addPayment = async (req, res) => {
  try {
    const response = await addPaymentService(req.user._id, req.body);

    successResponse(res, 200, "Payment added successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await getPaymentService(req.params.paymentId);

    successResponse(res, 200, "Payment fetched successfully", payment);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// payments
const getAllPayments = async function (req, res) {
  try {
    const payments = await getAllPaymentsService();

    successResponse(res, 200, "payments data fetched", payments);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

export { getPayment, addPayment, getAllPayments };
