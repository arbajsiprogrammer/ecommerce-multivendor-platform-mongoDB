import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { find, findOne } from "./common.repository.js";
import { mdb } from "../util/db.util.js";

const getAllOrdersRepository = async (field) => {
  const response = await find(COLLECTION.ORDER, { ...field });
  return response;
};

const getOrderRepository = async (customerId, orderId) => {
  const response = await findOne(COLLECTION.ORDER, {
    _id: new ObjectId(orderId),
    customerId,
  });
  return response;
};

const createOrderRepository = async (order, session) => {
  const response = await mdb
    .collection(COLLECTION.ORDER)
    .insertOne(order, { session });
  return response;
};

const deleteCartRepository = async (cartId, customerId, session) => {
  const response = await mdb.collection(COLLECTION.CART).deleteOne(
    {
      _id: new ObjectId(cartId),
      customerId,
    },
    { session },
  );

  return response;
};

export {
  getAllOrdersRepository,
  getOrderRepository,
  createOrderRepository,
  deleteCartRepository,
};
