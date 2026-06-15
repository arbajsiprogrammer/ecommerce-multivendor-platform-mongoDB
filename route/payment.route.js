import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  addPayment,
  getAllPayments,
  getPayment,
} from "../controller/payment.controller.js";

const router = express.Router();
router.post("/", verifyAuthToken, addPayment);
router.get("/:paymentId", verifyAuthToken, getPayment);
router.get("/", verifyAuthToken, getAllPayments);
export default router;
