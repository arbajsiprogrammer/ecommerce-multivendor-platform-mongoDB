import express from "express";
import {
  addItemToOrder,
  getAllOrders,
  getOrder,
} from "../controller/order.controller.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyAuthToken, addItemToOrder);

router.get("/", verifyAuthToken, getAllOrders);

router.get("/:id", verifyAuthToken, getOrder);

export default router;
