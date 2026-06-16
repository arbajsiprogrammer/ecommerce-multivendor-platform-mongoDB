import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { find, findOne, insertOne } from "./common.repository.js";
import { ApiError } from "../util/ApiError.util.js";

const getOrderById = async (orderId, customerId) => {
  const response = await findOne(COLLECTION.ORDER, {
    _id: new ObjectId(orderId),
    customerId,
  });

  return response;
};

const isReviewExist = async (customerId, productId, orderId) => {
  const existingReview = await findOne(COLLECTION.REVIEW, {
    customerId,
    productId,
    orderId,
  });

  if (existingReview) {
    throw new ApiError(400, "Review already exists");
  }
  return false;
};

const createReview = async (review) => {
  const response = await insertOne(COLLECTION.REVIEW, review);
};

const getAllReviewsRepository = async (productId) => {
  const response = await find(COLLECTION.REVIEW, { productId });
  return response;
};

export { getOrderById, isReviewExist, createReview, getAllReviewsRepository };
