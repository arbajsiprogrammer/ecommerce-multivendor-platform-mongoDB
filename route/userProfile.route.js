import express from "express";
import { verifyAuthToken } from "../middleware/auth.middleware.js";
import {
  deleteUser,
  logout,
  profile,
  refreshToken,
} from "../controller/userProfile.controller.js";

const router = express.Router();

router.post("/logout", verifyAuthToken, logout);

router.delete("/delete", verifyAuthToken, deleteUser);

router.get("/profile", verifyAuthToken, profile);

export default router;
