import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import mongoose from "mongoose";
import {
  createOrderService,
  getAllOrdersService,
  getOrderService,
  updateOrderStatusService,
} from "../service/order.service.js";
import { successResponse } from "../helper/response.helper.js";

// add item to order
const addItemToOrder = asyncHandler(async (req, res) => {
  const response = await createOrderService(req.user._id, req.body.cartId);

  successResponse(res, 200, "Order created successfully", response);
});

// get single order
const getOrder = asyncHandler(async (req, res) => {
  const order = await getOrderService(req.user._id, req.params.id);

  successResponse(res, 200, "Order fetched successfully", order);
});
// orders
const getAllOrders = asyncHandler(async function (req, res) {
  const orders = await getAllOrdersService(req.user);

  successResponse(res, 200, "orders data fetched", orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const response = await updateOrderStatusService(req.body, req.params);

  successResponse(res, 200, "Order status updated successfully", response);
});
export { addItemToOrder, getAllOrders, getOrder, updateOrderStatus };
