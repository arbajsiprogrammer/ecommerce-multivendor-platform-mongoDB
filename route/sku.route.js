import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  getAllSKU,
  addSKU,
  updateSKU,
  deleteSKU,
  addImage,
  getImages,
  deleteImage,
} from "../controller/sku.controller.js";

const router = express.Router();

// SKU'S
router.get("/products/:productId", verifyAuthToken, getAllSKU);
router.post("/products/:productId", verifyAuthToken, addSKU);

// router.get("/products/:productId/:SkuId", verifyAuthToken);

router.patch("/products/:productId/:SkuId", verifyAuthToken, updateSKU);
router.delete("/products/:productId/:SkuId", verifyAuthToken, deleteSKU);

// product sku's images
router.post("/:productId/:skuId/images", verifyAuthToken, addImage);
router.get("/:productId/:skuId/images", verifyAuthToken, getImages);
router.delete(
  "/:productId/:skuId/images/:imageId",
  verifyAuthToken,
  deleteImage,
);

export default router;
