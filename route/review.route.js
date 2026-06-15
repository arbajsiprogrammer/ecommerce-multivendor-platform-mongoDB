import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import { addReview, getAllReviews } from "../controller/review.controller.js";
import { validateCustomerRole } from "../middleware/customer.middleware.js";

const router = express.Router();

router.post("", verifyAuthToken, validateCustomerRole, addReview);
router.get("/:productId", verifyAuthToken, getAllReviews);

export default router;
