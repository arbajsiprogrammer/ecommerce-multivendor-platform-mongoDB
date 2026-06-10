import express from "express";
import { db } from "../util/db.util.js";
import { login, refreshToken, signup } from "../controller/auth.controller.js";
import { verifyAuthToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/refresh-token", refreshToken);

export default router;
