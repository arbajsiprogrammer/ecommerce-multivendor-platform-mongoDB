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

router.get("/:id", verifyAuthToken, getCartItem);
router.get("/", verifyAuthToken, getCartProducts);
router.post("/items", verifyAuthToken, addToCart);
router.put("/items/:id", verifyAuthToken, updateCartItems);
router.delete("/items/:id", verifyAuthToken, deleteCartItems);

export default router;
