import express from "express";
import { db } from "../util/db.util.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";

import { checkRole } from "../middleware/admin.middleware.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controller/category.controller.js";
import { getAllVendors } from "../controller/vendor.controller.js";
import { getAllCustomers } from "../controller/customer.controller.js";
import { getAllOrders } from "../controller/order.controller.js";
import { getAllPayments } from "../controller/payment.controller.js";

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
