import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  getAllProducts,
  getProduct,
  getProductsByCategory,
  getProductsByPage,
} from "../controller/customer.controller.js";

const router = express.Router();

// pagination for products
router.get("/products", verifyAuthToken, getProductsByPage);
// get all products
router.get("/products", verifyAuthToken, getAllProducts);
// get product by id
router.get("/products/:id", verifyAuthToken, getProduct);
// get products by category
router.get("/categories/:id/products", verifyAuthToken, getProductsByCategory);

export default router;
