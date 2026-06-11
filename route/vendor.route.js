import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getAllSKU,
  getProduct,
  updateProduct,
  addSKU,
  updateSKU,
  deleteSKU,
  addImage,
  getImages,
  deleteImage,
  updateOrderStatus,
} from "../controller/vendor.controller.js";
import {
  validateProduct,
  validateVendorRole,
} from "../middleware/vendor.middleware.js";

const router = express.Router();

router.get("/products", verifyAuthToken, validateVendorRole, getAllProducts);
router.get(
  "/products/:productId",
  verifyAuthToken,
  validateVendorRole,
  getProduct,
);
router.post(
  "/products",
  verifyAuthToken,
  validateVendorRole,
  validateProduct,
  addProduct,
);
router.put(
  "/products/:productId",
  verifyAuthToken,
  validateVendorRole,
  validateProduct,
  updateProduct,
);
router.delete("/products/sku", verifyAuthToken, validateVendorRole, deleteSKU);
router.delete(
  "/products/:productId",
  verifyAuthToken,
  validateVendorRole,
  deleteProduct,
);

// SKU'S
router.get("/products/:id/sku", verifyAuthToken, validateVendorRole, getAllSKU);
router.post("/products/:id/sku", verifyAuthToken, validateVendorRole, addSKU);
router.get("/products/sku/:id", verifyAuthToken, validateVendorRole);
router.patch("/products/sku", verifyAuthToken, validateVendorRole, updateSKU);

// product sku's images
router.post(
  "/products/sku/:productId/:skuId/images",
  verifyAuthToken,
  validateVendorRole,
  addImage,
);
router.get(
  "/products/sku/:productId/:skuId/images",
  verifyAuthToken,
  validateVendorRole,
  getImages,
);
router.delete(
  "/products/sku/:productId/:skuId/images/:imageId",
  verifyAuthToken,
  validateVendorRole,
  deleteImage,
);

// update product status
router.post(
  "/orders/:id",
  verifyAuthToken,
  validateVendorRole,
  updateOrderStatus,
);

export default router;
