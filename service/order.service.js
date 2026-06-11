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

export { getExistingOrders };
