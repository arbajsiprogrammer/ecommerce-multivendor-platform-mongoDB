import express from "express";
import { db } from "../util/db.util.js";
import {
  deleteUser,
  login,
  logout,
  profile,
  signup,
} from "../controller/auth.controller.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", verifyAuthToken, logout);

router.delete("/delete", verifyAuthToken, deleteUser);

router.post("/profile", verifyAuthToken, profile);

export default router;
