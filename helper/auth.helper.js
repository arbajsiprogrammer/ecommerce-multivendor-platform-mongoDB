import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";
import bcrypt from "bcryptjs";
import logger from "../service/log.service.js";
import { ObjectId } from "mongodb";
import {
  deleteOne,
  findOne,
  insertOne,
} from "../repository/auth.repository.js";

const deleteRefreshToken = async (user) => {
  const fields = { userId: user._id, sessionId: user.sessionId };
  const deleteResponse = await deleteOne(COLLECTION.REFRESH_TOKEN, fields);

  logger.info("token deleted from DB ", JSON.stringify(deleteResponse));
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
    throw new Error(
      ` failed to store refresh token in DB ${JSON.stringify(response)}`,
    );
  }
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

    throw new Error("refresh token expired...");
  }

  return dbRefreshToken;
};

// generating JWT access token
const generateToken = async (payload) => {
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
  const refreshToken = await jwt.sign(payload, refresh_secretKey, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  if (!refreshToken) {
    throw new Error("Refresh token generation failed");
  }
  logger.info(`Refresh token generation successful`);

  return refreshToken;
};

export {
  deleteRefreshToken,
  storeRefreshToken,
  getRefreshToken,
  generateToken,
  generateRefreshToken,
};
