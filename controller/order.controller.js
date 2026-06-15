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
import { errorResponse, successResponse } from "../helper/response.helper.js";

// add item to order
const addItemToOrder = async (req, res) => {
  try {
    const response = await createOrderService(req.user._id, req.body.cartId);

    successResponse(res, 200, "Order created successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// get single order
const getOrder = async (req, res) => {
  try {
    const order = await getOrderService(req.user._id, req.params.id);

    successResponse(res, 200, "Order fetched successfully", order);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};
// orders
const getAllOrders = async function (req, res) {
  try {
    const orders = await getAllOrdersService(req.user._id);

    successResponse(res, 200, "orders data fetched", orders);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const response = await updateOrderStatusService(req.body, req.params);

    successResponse(res, 200, "Order status updated successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};
export { addItemToOrder, getAllOrders, getOrder, updateOrderStatus };
