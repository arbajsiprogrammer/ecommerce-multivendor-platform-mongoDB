import express from "express";
import {
  addDeliveryAddress,
  deleteDeliveryAddress,
  getDeliveryAddress,
  updateDeliveryAddress,
} from "../controller/address.controller.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";

import { validateCustomerRole } from "../middleware/customer.middleware.js";

const router = express.Router();

router.get(
  "/delivery",
  verifyAuthToken,
  validateCustomerRole,
  getDeliveryAddress,
);
router.post(
  "/delivery",
  verifyAuthToken,
  validateCustomerRole,
  addDeliveryAddress,
);
router.put(
  "/delivery/:id",
  verifyAuthToken,
  validateCustomerRole,
  updateDeliveryAddress,
);
router.delete(
  "/delivery/:id",
  verifyAuthToken,
  validateCustomerRole,
  deleteDeliveryAddress,
);

export default router;
