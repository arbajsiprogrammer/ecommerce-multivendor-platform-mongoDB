import COLLECTION from "../Constants/collectionName.constant.js";
import { errorResponse } from "../helper/response.helper.js";
import { find, findOne } from "../repository/common.repository.js";

const getExistingOrders = async (orderId) => {
  const existingOrder = await findOne(COLLECTION.ORDER, orderId);

  if (!existingOrder) {
    throw new Error("Order not found");
  }
};

const getAllOrdersService = async () => {
  const response = await find(COLLECTION.ORDER, {});
  return response;
};

export { getExistingOrders, getAllOrdersService };
