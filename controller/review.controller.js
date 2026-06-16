import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import {
  addReviewService,
  getAllReviewsService,
} from "../service/review.service.js";
import { successResponse } from "../helper/response.helper.js";
import { asyncHandler } from "../util/asyncHandler.util.js";

const addReview = asyncHandler(async (req, res) => {
  const response = await addReviewService(req.user._id, req.body);

  successResponse(res, 200, "Review added successfully", response);
});

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await getAllReviewsService(req.params.productId);

  successResponse(res, 200, "Reviews fetched successfully", reviews);
});

export { addReview, getAllReviews };
