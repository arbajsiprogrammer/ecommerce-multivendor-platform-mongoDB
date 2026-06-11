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
import { checkRole } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/categories", verifyAuthToken, checkRole, getAllCategories);
router.get("/categories/:categoryId", verifyAuthToken, checkRole, getCategory);
router.put(
  "/categories/:categoryId",
  verifyAuthToken,
  checkRole,
  updateCategory,
);
router.post("/categories", verifyAuthToken, checkRole, addCategory);
router.delete(
  "/categories/:categoryId",
  verifyAuthToken,
  checkRole,
  deleteCategory,
);

// GET /admin/vendors
router.get("/vendors", verifyAuthToken, checkRole, getAllVendors);
// GET /admin/customers
router.get("/customers", verifyAuthToken, checkRole, getAllCustomers);
// GET /admin/orders
router.get("/orders", verifyAuthToken, checkRole, getAllOrders);
// GET /admin/payments
router.get("/payments", verifyAuthToken, checkRole, getAllPayments);

export default router;
