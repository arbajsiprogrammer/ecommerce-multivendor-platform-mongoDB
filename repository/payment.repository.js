import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";
import { findOne } from "./common.repository.js";

const createPaymentRepository = async (payment, session) => {
  const response = await mdb
    .collection(COLLECTION.PAYMENT)
    .insertOne(payment, { session });

  return response;
};

const getPaymentByOrderId = async (orderId) => {
  const response = await findOne(COLLECTION.PAYMENT, {
    orderId: new ObjectId(orderId),
  });
  return response;
};

const getPaymentRepository = async (paymentId) => {
  const response = await findOne(COLLECTION.PAYMENT, {
    _id: new ObjectId(paymentId),
  });

  return response;
};

export { createPaymentRepository, getPaymentByOrderId, getPaymentRepository };
