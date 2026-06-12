import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";

const addReview = async (req, res) => {
  try {
    const customerId = req.user._id;
    const role = req.user.role;
    console.log("req.body");
    console.log(req.body);
    const { productId, productSkusId, rating, review, orderId } = req.body;
    const product = await mdb
      .collection(COLLECTION.ORDER)
      .find({ _id: new ObjectId(orderId), customerId })
      .toArray();

    if (product.length == 0) {
      logger.warn(
        `Customer with id ${customerId} attempted to add a review for product ${productId} without purchasing it.`,
      );
      return res
        .status(400)
        .json({ message: " You are not allowed to add review " });
    }

    // adding review
    const response = await mdb.collection(COLLECTION.REVIEW).insertOne({
      customerId,
      productId,
      productSkusId,
      rating,
      review,
      orderId,
    });

    logger.info(
      `Customer with id ${customerId} added a review for product ${productId}. Review ID: ${response.insertedId}`,
    );
    // Log the review addition
    console.log(response, " review row inside addReview");
    return res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    logger.error(`Error in addReview: ${error}`);
    console.error("Error in addReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await mdb
      .collection(COLLECTION.REVIEW)
      .find({ productId })
      .toArray();

    if (reviews.length == 0) {
      logger.warn(`No reviews found for product with id ${productId}.`);
      return res.status(400).json({ message: "No reviews found " });
    }
    logger.info(
      `Reviews retrieved successfully for product with id ${productId}.`,
    );
    return res.status(200).json(reviews);
  } catch (error) {
    logger.error(`Error in getAllReviews: ${error}`);
    console.error("Error in getAllReviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addReview, getAllReviews };
