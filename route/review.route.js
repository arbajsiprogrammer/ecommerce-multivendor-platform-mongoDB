import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import { addReview, getAllReviews } from "../controller/review.controller.js";

const router = express.Router();

router.post("/", verifyAuthToken, addReview);
router.get("/:id", verifyAuthToken, getAllReviews);

export default router;
