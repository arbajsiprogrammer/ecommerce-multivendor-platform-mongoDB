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

router.get("/", verifyAuthToken, validateVendorRole, getPickupAddress);
router.post("/", verifyAuthToken, validateVendorRole, addPickupAddress);
router.put("/:id", verifyAuthToken, validateVendorRole, updatePickupAddress);
router.delete("/:id", verifyAuthToken, validateVendorRole, deletePickupAddress);

export default router;
