import express from "express";
import {
  addDeliveryAddress,
  deleteDeliveryAddress,
  getDeliveryAddress,
  updateDeliveryAddress,
} from "../controller/deliveryAddress.controller.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";

import { validateCustomerRole } from "../middleware/customer.middleware.js";

const router = express.Router();

router.get("/", verifyAuthToken, validateCustomerRole, getDeliveryAddress);
router.post("/", verifyAuthToken, validateCustomerRole, addDeliveryAddress);
router.put(
  "/:id",
  verifyAuthToken,
  validateCustomerRole,
  updateDeliveryAddress,
);
router.delete(
  "/:id",
  verifyAuthToken,
  validateCustomerRole,
  deleteDeliveryAddress,
);

export default router;
