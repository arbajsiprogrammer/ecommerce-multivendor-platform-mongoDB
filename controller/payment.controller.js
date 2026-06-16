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
import { asyncHandler } from "../util/asyncHandler.util.js";
const addPayment = asyncHandler(async (req, res) => {
  const response = await addPaymentService(req.user._id, req.body);

  successResponse(res, 200, "Payment added successfully", response);
});

const getPayment = asyncHandler(async (req, res) => {
  const payment = await getPaymentService(req.params.paymentId);

  successResponse(res, 200, "Payment fetched successfully", payment);
});

// payments
const getAllPayments = asyncHandler(async function (req, res) {
  const payments = await getAllPaymentsService();

  successResponse(res, 200, "payments data fetched", payments);
});

export { getPayment, addPayment, getAllPayments };
