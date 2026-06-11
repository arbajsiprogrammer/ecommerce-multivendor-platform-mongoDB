import express from "express";
import {
  validateRole,
  verifyAuthToken,
} from "../middleware/auth.middleware.js";
import {
  deleteUser,
  logout,
  logoutFromAllDevices,
  profile,
} from "../controller/userProfile.controller.js";

const router = express.Router();

router.post("/logout", verifyAuthToken, validateRole, logout);

router.delete("/delete", verifyAuthToken, validateRole, deleteUser);

router.get("/profile", verifyAuthToken, validateRole, profile);

router.get(
  "/logout-from-all-devices",
  validateRole,
  verifyAuthToken,
  logoutFromAllDevices,
);

export default router;
