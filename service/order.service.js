import COLLECTION from "../Constants/collectionName.constant.s";
import { errorResponse } from "../helper/response.helper";

const getExistingOrders = async (orderId) => {
  const existingOrder = await mdb
    .collection(COLLECTION.ORDER)
    .findOne({ _id: new ObjectId(orderId) });

  if (!existingOrder) {
    throw new Error("Order not found");
  }
};

export { getExistingOrders };
