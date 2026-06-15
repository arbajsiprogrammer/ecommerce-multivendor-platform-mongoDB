import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  addToCart,
  deleteCartItems,
  getCartItem,
  getCartProducts,
  updateCartItems,
} from "../controller/cart.controller.js";
import { validateCustomerRole } from "../middleware/customer.middleware.js";

const router = express.Router();

router.get("/:cartItemId", verifyAuthToken, validateCustomerRole, getCartItem);
router.get("/", verifyAuthToken, validateCustomerRole, getCartProducts);
router.post(
  "/items/:productId/:skuId",
  verifyAuthToken,
  validateCustomerRole,
  addToCart,
);
router.put(
  "/items/:cartItemId",
  verifyAuthToken,
  validateCustomerRole,
  updateCartItems,
);
router.delete(
  "/items/:cartItemId",
  verifyAuthToken,
  validateCustomerRole,
  deleteCartItems,
);

export default router;
