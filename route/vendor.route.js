import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";

import { validateVendorRole } from "../middleware/vendor.middleware.js";
import productRouter from "../route/product.route.js";
import orderRouter from "../route/order.route.js";
import { getAllVendors } from "../controller/vendor.controller.js";
const router = express.Router();

router.use("/products", verifyAuthToken, validateVendorRole, productRouter);

router.get("/", verifyAuthToken, validateVendorRole, getAllVendors);

router.use("/orders", orderRouter);

// update product status

export default router;
