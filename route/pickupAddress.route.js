import express from "express";
import {
  addPickupAddress,
  getPickupAddress,
  deletePickupAddress,
  updatePickupAddress,
} from "../controller/pickupAddress.controller.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import { validateVendorRole } from "../middleware/vendor.middleware.js";

const router = express.Router();

router.get("/pickup", verifyAuthToken, validateVendorRole, getPickupAddress);
router.post("/pickup", verifyAuthToken, validateVendorRole, addPickupAddress);
router.put(
  "/pickup/:id",
  verifyAuthToken,
  validateVendorRole,
  updatePickupAddress,
);
router.delete(
  "/pickup/:id",
  verifyAuthToken,
  validateVendorRole,
  deletePickupAddress,
);

export default router;
