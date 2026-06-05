import express from "express";
import {
  addDeliveryAddress,
  addPickupAddress,
  deleteDeliveryAddress,
  deletePickupAddress,
  getDeliveryAddress,
  getPickupAddress,
  updateDeliveryAddress,
  updatePickupAddress,
} from "../controller/address.controller.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/pickup", verifyAuthToken, getPickupAddress);
router.post("/pickup", verifyAuthToken, addPickupAddress);
router.put("/pickup/:id", verifyAuthToken, updatePickupAddress);
router.delete("/pickup/:id", verifyAuthToken, deletePickupAddress);

router.get("/delivery", verifyAuthToken, getDeliveryAddress);
router.post("/delivery", verifyAuthToken, addDeliveryAddress);
router.put("/delivery/:id", verifyAuthToken, updateDeliveryAddress);
router.delete("/delivery/:id", verifyAuthToken, deleteDeliveryAddress);

export default router;
