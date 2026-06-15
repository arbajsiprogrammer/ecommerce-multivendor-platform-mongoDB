import express from "express";
import authRoute from "./auth.route.js";
import adminRouter from "./admin.route.js";
import vendorRouter from "./vendor.route.js";
import customerRouter from "./customer.route.js";
import cartRouter from "./cart.route.js";
import pickupAddressRouter from "./pickupAddress.route.js";
import deliveryAddressRouter from "./deliveryAddress.route.js";
import orderRouter from "./order.route.js";
import reviewRouter from "./review.route.js";
import paymentRouter from "./payment.route.js";
import userProfileRouter from "./userProfile.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user-profile", userProfileRouter);
router.use("/admin", adminRouter);
router.use("/vendor", vendorRouter);
router.use("/customer", customerRouter);
router.use("/cart", cartRouter);
router.use("/pickup-address", pickupAddressRouter);
router.use("/delivery-address", deliveryAddressRouter);
router.use("/order", orderRouter);
router.use("/review", reviewRouter);
router.use("/payment", paymentRouter);

export default router;
