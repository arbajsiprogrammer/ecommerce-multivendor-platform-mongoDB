import logger from "../service/log.service.js";
import { db } from "../util/db.util.js";

const addReview = async (req, res) => {
  try {
    const customerId = req.user.id;
    const role = req.user.role;
    const { product_id, product_skus_id, rating, review } = req.body;

    // Check if the user has purchased the product
    const [product] = await db.execute(
      `select product_skus_id, order_id from order_items where order_id = any(select id from orders where customer_id = ?) and product_skus_id = ?`,
      [customerId, product_skus_id],
    );

    if (product.length == 0) {
      logger.warn(
        `Customer with id ${customerId} attempted to add a review for product ${product_id} without purchasing it.`,
      );
      return res
        .status(400)
        .json({ message: " You are not allowed to add review " });
    }

    // adding review
    const [row] = await db.execute(
      `insert into reviews (customer_id, product_id, product_skus_id, rating, review, order_id) values (?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        product_id,
        product[0].product_skus_id,
        rating,
        review,
        product[0].order_id,
      ],
    );
    logger.info(
      `Customer with id ${customerId} added a review for product ${product_id}. Review ID: ${row.insertId}`,
    ); // Log the review addition
    console.log(row, " review row inside addReview");
    return res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    logger.error(`Error in addReview: ${error.message}`);
    console.error("Error in addReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const product_id = req.params.id;

    const [reviews] = await db.execute(
      `select * from reviews where product_id = ? or product_skus_id = ?`,
      [product_id, product_id],
    );
    if (reviews.length == 0) {
      logger.warn(`No reviews found for product with id ${product_id}.`);
      return res.status(400).json({ message: "No reviews found " });
    }
    logger.info(
      `Reviews retrieved successfully for product with id ${product_id}.`,
    );
    return res.status(200).json({ reviews });
  } catch (error) {
    logger.error(`Error in getAllReviews: ${error.message}`);
    console.error("Error in getAllReviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addReview, getAllReviews };
