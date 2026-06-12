import COLLECTION from "../Constants/collectionName.constant.js";
import { errorResponse } from "../helper/response.helper.js";

const getExistingOrders = async (orderId) => {
  const existingOrder = await mdb
    .collection(COLLECTION.ORDER)
    .findOne({ _id: new ObjectId(orderId) });

  if (!existingOrder) {
    throw new Error("Order not found");
  }
};

const getAllOrdersService = async () => {
  const response = await find(COLLECTION.ORDER, {});
  return response;
};

export { getExistingOrders, getAllOrdersService };
