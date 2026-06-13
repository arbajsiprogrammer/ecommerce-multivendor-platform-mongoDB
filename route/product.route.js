import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controller/product.controller.js";
import skuRouter from "../route/sku.route.js";
import { validateProduct } from "../middleware/product.middleware.js";

const router = express.Router();

router.use("/:productId/sku", skuRouter);

router.get("/", verifyAuthToken, getAllProducts);
router.get("/:productId", verifyAuthToken, getProduct);
router.post("/", verifyAuthToken, validateProduct, addProduct);
router.put("/:productId", verifyAuthToken, validateProduct, updateProduct);
router.delete("/:productId", verifyAuthToken, deleteProduct);

export default router;
