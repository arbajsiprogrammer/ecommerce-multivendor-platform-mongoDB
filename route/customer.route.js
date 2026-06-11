import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  getAllProducts,
  getProduct,
  getProductsByCategory,
  getProductsByPage,
} from "../controller/customer.controller.js";
import { validateCustomerRole } from "../middleware/customer.middleware.js";

const router = express.Router();

// pagination for products
router.get(
  "/products/pagination",
  verifyAuthToken,
  validateCustomerRole,
  getProductsByPage,
);
// get all products
router.get("/products", verifyAuthToken, validateCustomerRole, getAllProducts);
// get product by id
router.get("/products/:id", verifyAuthToken, validateCustomerRole, getProduct);
// get products by category
router.get(
  "/categories/:id/products",
  validateCustomerRole,
  verifyAuthToken,
  getProductsByCategory,
);

export default router;
