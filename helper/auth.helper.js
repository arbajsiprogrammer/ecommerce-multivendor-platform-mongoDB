import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";
import bcrypt from "bcryptjs";
import logger from "../service/log.service.js";
import { ObjectId } from "mongodb";
import { insertOne } from "../repository/auth.repository.js";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../Constants/authToken.constant.js";

// generating JWT access token
const generateToken = async (payload) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const accessToken = await jwt.sign(payload, secretKey, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  if (!accessToken) {
    throw new Error("Access Token generation failed");
  }
  logger.info("Token generation successful");
  return accessToken;
};

// generating JWT refresh token
const generateRefreshToken = async (payload) => {
  const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
  const refreshToken = await jwt.sign(payload, refreshSecretKey, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  if (!refreshToken) {
    throw new Error("Refresh token generation failed");
  }
  logger.info(`Refresh token generation successful`);

  return refreshToken;
};

export { generateToken, generateRefreshToken };
