import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_EXPIRY_OPTIONS,
  REFRESH_TOKEN_EXPIRY,
} from "../Constants/authToken.constant.js";
import logger from "./log.service.js";
import { mdb } from "../util/db.util.js";
import { errorResponse } from "../helper/response.helper.js";
import {
  deleteRefreshToken,
  getRefreshToken,
  storeRefreshToken,
} from "../helper/auth.helper.js";
import COLLECTION from "../Constants/collectionName.constant.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
const refresh_secretKey = process.env.JWT_REFRESH_SECRET_KEY;

// generating JWT access token
const generateToken = async (payload) => {
  return await jwt.sign(payload, secretKey, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const verifyToken = async (token) => {
  try {
    console.log("secretKey", secretKey);
    const user = await jwt.verify(token, secretKey);
    console.log(user, "*********user inside verify token ");
    return user;
  } catch (error) {
    console.log(error);
  }
};

// generating JWT refresh token

const generateRefreshToken = async (payload) => {
  return await jwt.sign(payload, refresh_secretKey, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const verifyRefreshToken = async (token) => {
  try {
    const user = await jwt.verify(token, refresh_secretKey);

    logger.info(`user inside verify refresh token ${JSON.stringify(user)}`);

    if (!user) {
      throw new error("refresh token verification failed");
    }

    // get token from DB
    const dbRefreshToken = getRefreshToken(user);

    const isMatch = await bcrypt.compare(token, dbRefreshToken.token);

    if (!isMatch) {
      throw new error("Refresh token not matched");
    }

    return user;
  } catch (error) {
    throw new error(error.message);
  }
};
// hashing password
const hashPassword = async function (password) {
  try {
    const hashed = await bcrypt.hash(password, 10);
    console.log(hashed, "inside hash password service");
    return hashed;
  } catch (error) {
    console.log(error);
  }
};

const verifyPassword = async function (password, hashed_password) {
  try {
    const isMatch = await bcrypt.compare(password, hashed_password);
    console.log(isMatch, "inside verify password service");
    return isMatch;
  } catch (error) {
    console.error(error);
  }
};

const findUserByPhone = async (role, phoneNumber) => {
  try {
    // check if user is already exist or not
    const existingUser = await mdb
      .collection(`${role}s`)
      .findOne({ phoneNumber });

    logger.warn(`existing user in signup ${JSON.stringify(existingUser)}`);
    return existingUser;
  } catch (error) {
    logger.error(`internal server error.... ${error}`);
  }
};

const storeTokens = async function (res, payload) {
  try {
    // access token
    const AccessToken = await generateToken(payload);
    if (!AccessToken) {
      errorResponse(res, 400, "Access Token generation failed");
    }
    logger.info("Token generation successful");

    // generating refresh token
    const refreshToken = await generateRefreshToken(payload);
    if (!refreshToken) {
      errorResponse(res, 400, "Refresh token generation failed");
    }
    logger.info(`Refresh token generation successful`);

    // store refresh token into DB
    storeRefreshToken(payload, refreshToken);

    // store tokens into the cookies
    res.cookie(ACCESS_TOKEN, AccessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);
    res.cookie(REFRESH_TOKEN, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const generateNewTokens = async (user) => {
  const { iat, exp, ...payload } = user;
  // generating new Access token
  const accessToken = await generateToken(payload);

  if (!accessToken) {
    throw new error("access token generation failed ");
  }

  // now generating new REFRESH TOKEN
  const refreshToken = await generateRefreshToken(payload);
  if (!refreshToken) {
    throw new error("refresh token generation failed ");
  }

  return { accessToken, refreshToken };
};

const rotateRefreshToken = async (user, refreshToken) => {
  // delete previous one and add new
  deleteRefreshToken(user);
  // storing refresh token in DB
  storeRefreshToken(user, refreshToken);
};
export {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
  verifyPassword,
  findUserByPhone,
  storeTokens,
  generateNewTokens,
  rotateRefreshToken,
};
