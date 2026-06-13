import COLLECTION from "../Constants/collectionName.constant.js";
import { updateOrderStatusHelper } from "../helper/order.helper.js";
import { errorResponse } from "../helper/response.helper.js";
import { find, findOne, updateOne } from "../repository/common.repository.js";

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

const updateOrderStatusService = async (body, params) => {
  const orderId = params.orderId;
  const orderTracksId = body.id || crypto.randomUUID();
  const remarks = body.remarks;
  const status = body.status;

  const existingOrder = await getExistingOrders(orderId);
  const updatedOrderTracks = updateOrderStatusHelper(existingOrder);
  const response = await updateOne(
    COLLECTION.ORDER,
    { _id: new ObjectId(orderId) },
    {
      orderTracks: newOrderTracks,
    },
  );
  return response;
};
export { getExistingOrders, getAllOrdersService, updateOrderStatusService };
