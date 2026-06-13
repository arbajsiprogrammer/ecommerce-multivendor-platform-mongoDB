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

const router = express.Router({ mergeParams: true });

// SKU'S
router.get("/", verifyAuthToken, getAllSKU);
router.post("/", verifyAuthToken, addSKU);

// router.get("/products/:productId/:SkuId", verifyAuthToken);

router.patch("/:skuId", verifyAuthToken, updateSKU);
router.delete("/:skuId", verifyAuthToken, deleteSKU);

// product sku's images
router.post("/:skuId/images", verifyAuthToken, addImage);
router.get("/:skuId/images", verifyAuthToken, getImages);
router.delete("/:skuId/images/:imageId", verifyAuthToken, deleteImage);

export default router;
