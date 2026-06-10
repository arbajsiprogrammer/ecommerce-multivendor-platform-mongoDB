import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  deleteUser,
  logout,
  logoutFromAllDevices,
  profile,
} from "../controller/userProfile.controller.js";

const router = express.Router();

router.post("/logout", verifyAuthToken, logout);

router.delete("/delete", verifyAuthToken, deleteUser);

router.get("/profile", verifyAuthToken, profile);

router.get("/logout-from-all-devices", verifyAuthToken, logoutFromAllDevices);

export default router;
