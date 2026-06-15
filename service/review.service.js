import {
  calculateAverageRating,
  validatePurchasedProduct,
} from "../helper/review.helper.js";
import { find, findOne } from "../repository/common.repository.js";
import {
  createReview,
  getAllReviewsRepository,
  getOrderById,
  isReviewExist,
} from "../repository/review.repository.js";

const addReviewService = async (customerId, body) => {
  const { orderId, productId, productSkusId, rating, review } = body;

  const order = await getOrderById(orderId, customerId);

  validatePurchasedProduct(order, productId, productSkusId);
  await isReviewExist(customerId, productId, orderId);

  const reviewObject = {
    customerId,
    productId,
    productSkusId,
    rating,
    review,
    orderId,
  };
  const response = await createReview(reviewObject);

  return response;
};

const getAllReviewsService = async (productId) => {
  const reviews = await getAllReviewsRepository(productId);

  const averageRating = calculateAverageRating(reviews);
  const totalReviews = reviews.length;

  const reviewObject = {
    averageRating,
    totalReviews,
    reviews,
  };

  return reviewObject;
};

export { addReviewService, getAllReviewsService };
