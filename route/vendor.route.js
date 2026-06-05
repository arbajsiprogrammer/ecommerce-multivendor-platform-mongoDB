import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getAllSKU,
  getProduct,
  getSKU,
  updateProduct,
  addSKU,
  updateSKU,
  deleteSKU,
  addImage,
  getImages,
  deleteImage,
  updateOrderStatus,
} from "../controller/vendor.controller.js";

const router = express.Router();

router.get("/products", verifyAuthToken, getAllProducts);
router.get("/products/:id", verifyAuthToken, getProduct);
router.post("/products", verifyAuthToken, addProduct);
router.put("/products/:id", verifyAuthToken, updateProduct);
router.delete("/products/:id", verifyAuthToken, deleteProduct);

// SKU'S
router.get("/products/:id/sku", verifyAuthToken, getAllSKU);
router.post("/products/:id/sku", verifyAuthToken, addSKU);
router.get("/products/sku/:id", verifyAuthToken, getSKU);
router.put("/products/sku/:id", verifyAuthToken, updateSKU);
router.delete("/products/sku/:id", verifyAuthToken, deleteSKU);

// product sku's images
router.post("/products/sku/:id/images", verifyAuthToken, addImage);
router.get("/products/sku/:id/images", verifyAuthToken, getImages);
router.delete("/products/sku/images/:id", verifyAuthToken, deleteImage);

// update product status
router.patch("/orders/:id", verifyAuthToken, updateOrderStatus);

export default router;
