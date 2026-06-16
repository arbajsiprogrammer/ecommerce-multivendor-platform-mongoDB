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
import {
  generateNewTokens,
  generateRefreshToken,
  generateToken,
  getCollectionName,
  hashPassword,
  verifyPassword,
} from "../helper/auth.helper.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import {
  deleteOne,
  findOne,
  insertOne,
} from "../repository/common.repository.js";
import { ObjectId } from "mongodb";
import { findUserByPhone } from "../repository/auth.repository.js";
import { ApiError } from "../util/ApiError.util.js";

dotenv.config();

const verifyToken = async (token) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const user = await jwt.verify(token, secretKey);
  return user;
};

const verifyRefreshToken = async (token) => {
  const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
  const user = await jwt.verify(token, refreshSecretKey);

  if (!user) {
    throw new ApiError(401, "refresh token verification failed");
  }

  // get token from DB
  const dbRefreshToken = await getRefreshToken(user);

  const isMatch = await bcrypt.compare(token, dbRefreshToken.token);

  if (!isMatch) {
    throw new ApiError(401, "Refresh token not matched");
  }

  return user;
};

const createTokens = async function (payload) {
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
};

const rotateRefreshToken = async (user, refreshToken) => {
  // delete previous one and add new
  await deleteRefreshToken(user);
  // storing refresh token in DB
  await storeRefreshToken(user, refreshToken);
};

const getRoleId = async (role) => {
  const response = await findOne(COLLECTION.ROLE, { roleName: role });

  const roleId = response._id;
  return roleId;
};

const createUser = async (user) => {
  const role = user.role;

  if (role == "admin" || role == "vendor") {
    const response = insertOne(COLLECTION.PLATFORM_USER, user);
    return response;
  } else {
    const response = insertOne(COLLECTION.CUSTOMER, user);
    return response;
  }
};

const deleteRefreshToken = async (user) => {
  const fields = { userId: user._id, sessionId: user.sessionId };
  const deleteResponse = await deleteOne(COLLECTION.REFRESH_TOKEN, fields);

  logger.info("token deleted from DB ", JSON.stringify(deleteResponse));
};

const getRefreshToken = async (user) => {
  // get token from DB
  const collectionName = COLLECTION.REFRESH_TOKEN;
  const fields = { sessionId: user.sessionId, userId: new ObjectId(user._id) };

  const dbRefreshToken = await findOne(collectionName, fields);

  //   check expiry
  if (dbRefreshToken.expiresAt < new Date()) {
    // delete expired token
    const collectionName = COLLECTION.REFRESH_TOKEN;
    const fields = { userId: user._id, sessionId: user.sessionId };
    const deleteResponse = await deleteOne(collectionName, fields);

    throw new ApiError(401, "refresh token expired...");
  }

  return dbRefreshToken;
};

const storeRefreshToken = async function (payload, refreshToken) {
  // hashing refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  // storing refresh token in DB
  const refreshTokenObject = {
    sessionId: payload.sessionId,
    userId: payload._id,
    token: hashedRefreshToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  };

  const response = await insertOne(
    COLLECTION.REFRESH_TOKEN,
    refreshTokenObject,
  );

  if (response) {
    logger.info(`refresh token stored in DB ${JSON.stringify(response)}`);
  } else {
    throw new ApiError(
      401,
      ` failed to store refresh token in DB ${JSON.stringify(response)}`,
    );
  }
};

const signUpService = async (user) => {
  // check if user exist
  const collectionName = getCollectionName(user.role);

  const existingUser = await findUserByPhone(collectionName, user.phoneNumber);

  if (existingUser) {
    throw new ApiError(400, "User already exist...please log in");
  }
  // hash password
  user.password = await hashPassword(user.password);

  // add role Id
  user.roleId = await getRoleId(user.role);

  // create new user
  const response = await createUser(user);
  return response;
};

const loginService = async (body) => {
  const { phoneNumber, password, role } = body;

  const collectionName = getCollectionName(role);

  const existingUser = await findUserByPhone(collectionName, phoneNumber);

  if (!existingUser) {
    throw new ApiError(401, "Invalid credentials...user not found");
  }

  const isMatch = await verifyPassword(password, existingUser.password);

  const payload = {
    phoneNumber,
    role,
    roleId: existingUser.roleId,
    _id: existingUser._id,
  };
  const tokens = await createTokens(payload);
  return tokens;
};

const refreshTokenService = async (incomingRefreshToken) => {
  const user = await verifyRefreshToken(incomingRefreshToken);

  // now generating access token
  const tokens = await generateNewTokens(user);
  return tokens;

  //Refresh Token Rotation
  await rotateRefreshToken(user, refreshToken);
};

export {
  verifyToken,
  verifyRefreshToken,
  createTokens,
  rotateRefreshToken,
  getRoleId,
  createUser,
  deleteRefreshToken,
  getRefreshToken,
  storeRefreshToken,
  signUpService,
  loginService,
  refreshTokenService,
};
