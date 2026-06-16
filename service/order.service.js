import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { validateCartItem } from "../helper/cart.helper.js";
import {
  createOrderObject,
  getSku,
  updateOrderStatusHelper,
  validateCart,
} from "../helper/order.helper.js";
import { errorResponse } from "../helper/response.helper.js";
import { getCart } from "../repository/cart.repository.js";
import { find, findOne, updateOne } from "../repository/common.repository.js";
import {
  createOrderRepository,
  deleteCartRepository,
  getAllOrdersRepository,
  getOrderRepository,
} from "../repository/order.repository.js";
import mongoose from "mongoose";
import { ApiError } from "../util/ApiError.util.js";

const getExistingOrders = async (orderId) => {
  const existingOrder = await findOne(COLLECTION.ORDER, orderId);

  if (!existingOrder) {
    throw new ApiError(400, "Order not found");
  }
};

const getAllOrdersService = async (user) => {
  let orders;
  if (user.role == "admin") {
    orders = await getAllOrdersRepository({});
  } else {
    orders = await getAllOrdersRepository({ customerId });
  }

  return orders;
};

const getOrderService = async (customerId, orderId) => {
  const order = await getOrderRepository(customerId, orderId);

  return order;
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

const createOrderService = async (customerId, cartId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const cart = await getCart(customerId);
    console.log("cart", cart);
    validateCart(cart);

    const orderItems = await createOrderItems(cart.cartItems);

    const order = createOrderObject(customerId, orderItems);

    const response = await createOrderRepository(order, session);

    await deleteCartRepository(cartId, customerId, session);

    await session.commitTransaction();

    return response;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const createOrderItems = async (cartItems) => {
  const orderItems = [];

  for (const item of cartItems) {
    const id = crypto.randomUUID();

    const product = await findOne(COLLECTION.PRODUCT, {
      _id: new ObjectId(item.productId),
    });

    const sku = getSku(product.productSkuses, item.productSkuId);

    orderItems.push({
      id,
      vendorId: product.vendorId,
      productId: product._id,
      productSkusId: sku.id,
      quantity: item.quantity,
      skuPriceSnapshot: sku.price,
      productNameSnapshot: product.productName,
      totalAmount: sku.price * item.quantity,
    });
  }

  return orderItems;
};
export {
  getExistingOrders,
  getAllOrdersService,
  updateOrderStatusService,
  getOrderService,
  createOrderItems,
  createOrderService,
};
