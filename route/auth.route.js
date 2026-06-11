import express from "express";
import { db } from "../util/db.util.js";
import { login, refreshToken, signup } from "../controller/auth.controller.js";
import {
  validateRole,
  validateSignup,
  verifyAuthToken,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", validateSignup, validateRole, signup);

router.post("/login", validateRole, login);

router.get("/refresh-token", refreshToken);

export default router;
