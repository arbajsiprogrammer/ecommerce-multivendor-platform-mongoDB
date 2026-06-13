import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";
import bcrypt from "bcryptjs";
import logger from "../service/log.service.js";
import { ObjectId } from "mongodb";
import { insertOne } from "../repository/common.repository.js";
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

  return refreshToken;
};

// hashing password
const hashPassword = async function (password) {
  try {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  } catch (error) {
    throw new Error(error);
  }
};

const verifyPassword = async function (password, hashed_password) {
  try {
    const isMatch = await bcrypt.compare(password, hashed_password);
    if (!isMatch) {
      throw new Error("Invalid credentials...password not match");
    }
    return true;
  } catch (error) {
    console.error(error);
  }
};

const generateNewTokens = async (user) => {
  const { iat, exp, ...payload } = user;
  // generating new Access token
  const accessToken = await generateToken(payload);

  // now generating new REFRESH TOKEN
  const refreshToken = await generateRefreshToken(payload);

  return { accessToken, refreshToken };
};
export {
  generateToken,
  generateRefreshToken,
  hashPassword,
  verifyPassword,
  generateNewTokens,
};
