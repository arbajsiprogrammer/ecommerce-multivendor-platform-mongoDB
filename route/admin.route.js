import express from "express";
import { db } from "../util/db.util.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getAllCustomers,
  getAllOrders,
  getAllPayments,
  getAllVendors,
  getCategory,
  updateCategory,
} from "../controller/admin.controller.js";

const router = express.Router();

router.get("/categories", verifyAuthToken, getAllCategories);
router.get("/categories/:id", verifyAuthToken, getCategory);
router.put("/categories/:id", verifyAuthToken, updateCategory);
router.post("/categories", verifyAuthToken, addCategory);
router.delete("/categories/:id", verifyAuthToken, deleteCategory);

// GET /admin/vendors
router.get("/vendors", verifyAuthToken, getAllVendors);
// GET /admin/customers
router.get("/customers", verifyAuthToken, getAllCustomers);
// GET /admin/orders
router.get("/orders", verifyAuthToken, getAllOrders);
// GET /admin/payments
router.get("/payments", verifyAuthToken, getAllPayments);

export default router;
