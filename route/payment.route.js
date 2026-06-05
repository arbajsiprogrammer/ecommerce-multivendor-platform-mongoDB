import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import { addPayment, getPayment } from "../controller/payment.controller.js";

const router = express.Router();
router.post("/", verifyAuthToken, addPayment);
router.get("/:id", verifyAuthToken, getPayment);
export default router;
