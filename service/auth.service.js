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
  generateToken,
  getRefreshToken,
  storeRefreshToken,
} from "../helper/auth.helper.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import { findOne, insertOne } from "../repository/auth.repository.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
const refresh_secretKey = process.env.JWT_REFRESH_SECRET_KEY;

const verifyToken = async (token) => {
  try {
    const user = await jwt.verify(token, secretKey);

    return user;
  } catch (error) {
    console.log(error);
  }
};

const verifyRefreshToken = async (token) => {
  try {
    const user = await jwt.verify(token, refresh_secretKey);

    if (!user) {
      throw new Error("refresh token verification failed");
    }

    // get token from DB
    const dbRefreshToken = await getRefreshToken(user);

    const isMatch = await bcrypt.compare(token, dbRefreshToken.token);

    if (!isMatch) {
      throw new Error("Refresh token not matched");
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
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

    return isMatch;
  } catch (error) {
    console.error(error);
  }
};

const findUserByPhone = async (role, phoneNumber) => {
  try {
    let existingUser;
    // check if user is already exist or not
    if (role == "admin" || role == "vendor") {
      const collectionName = COLLECTION.PLATFORM_USER;
      const fields = { phoneNumber };

      existingUser = await findOne(collectionName, fields);
    } else {
      const collectionName = COLLECTION.COLLECTION.CUSTOMER;
      const fields = { phoneNumber };

      existingUser = await findOne(collectionName, fields);
    }

    logger.warn(
      `existing user in findUserByPhone ${JSON.stringify(existingUser)}`,
    );
    return existingUser;
  } catch (error) {
    logger.error(`internal server error.... ${error}`);
  }
};

const createTokens = async function (payload) {
  try {
    // access token
    const accessToken = await generateToken(payload);

    // generating universal unique ID for identifying refresh token from db
    const sessionId = crypto.randomUUID();
    payload = { sessionId, ...payload };

    // generating refresh token
    const refreshToken = await generateRefreshToken(payload);

    // store refresh token into DB
    await storeRefreshToken(payload, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(error.message);
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

const rotateRefreshToken = async (user, refreshToken) => {
  // delete previous one and add new
  await deleteRefreshToken(user);
  // storing refresh token in DB
  await storeRefreshToken(user, refreshToken);
};

const getRoleId = async (role) => {
  try {
    const response = await mdb
      .collection(COLLECTION.ROLE)
      .findOne({ roleName: role });

    const roleId = response._id;
    return roleId;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUser = async (user) => {
  try {
    const role = user.role;

    if (role == "admin" || role == "vendor") {
      const response = insertOne(COLLECTION.PLATFORM_USER, user);
      return response;
    } else {
      const response = insertOne(COLLECTION.CUSTOMER, user);
      return response;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
export {
  verifyToken,
  verifyRefreshToken,
  hashPassword,
  verifyPassword,
  findUserByPhone,
  createTokens,
  generateNewTokens,
  rotateRefreshToken,
  getRoleId,
  createUser,
};
