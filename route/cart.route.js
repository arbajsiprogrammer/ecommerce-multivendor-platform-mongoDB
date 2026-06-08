import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  addToCart,
  deleteCartItems,
  getCartItem,
  getCartProducts,
  updateCartItems,
} from "../controller/cart.controller.js";

const router = express.Router();

router.get("/:cartItemId", verifyAuthToken, getCartItem);
router.get("/", verifyAuthToken, getCartProducts);
router.post("/items/:productId/:skuId", verifyAuthToken, addToCart);
router.put("/items/:cartItemId", verifyAuthToken, updateCartItems);
router.delete("/items/:cartItemId", verifyAuthToken, deleteCartItems);

export default router;
