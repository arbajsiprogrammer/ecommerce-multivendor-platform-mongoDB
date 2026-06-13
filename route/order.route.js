import express from "express";
import {
  addItemToOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
} from "../controller/order.controller.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import { validateVendorRole } from "../middleware/vendor.middleware.js";

const router = express.Router();

router.post("/", verifyAuthToken, addItemToOrder);

router.get("/", verifyAuthToken, getAllOrders);

router.get("/:id", verifyAuthToken, getOrder);
router.post("/:id", verifyAuthToken, validateVendorRole, updateOrderStatus);
export default router;
