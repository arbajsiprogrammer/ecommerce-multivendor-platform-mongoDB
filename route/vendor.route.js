import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";

import { validateVendorRole } from "../middleware/vendor.middleware.js";
import productRouter from "../route/product.route.js";
import skuRouter from "../route/sku.route.js";
import orderRouter from "../route/order.route.js";
import { getAllVendors } from "../controller/vendor.controller.js";
const router = express.Router();

router.use("/products", validateVendorRole, productRouter);

router.use("/sku", validateVendorRole, skuRouter);

router.get("/", validateVendorRole, getAllVendors);

router.use("/orders");

// update product status

export default router;
