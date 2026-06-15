import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import {
  addReviewService,
  getAllReviewsService,
} from "../service/review.service.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
const addReview = async (req, res) => {
  try {
    const response = await addReviewService(req.user._id, req.body);

    successResponse(res, 200, "Review added successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await getAllReviewsService(req.params.productId);

    successResponse(res, 200, "Reviews fetched successfully", reviews);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

export { addReview, getAllReviews };
