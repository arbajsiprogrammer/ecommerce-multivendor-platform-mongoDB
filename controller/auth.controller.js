import {
  ACCESS_TOKEN_EXPIRY_OPTIONS,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_EXPIRY_OPTIONS,
  REFRESH_TOKEN_NAME,
} from "../Constants/authToken.constant.js";
import COLLECTION_NAMES from "../Constants/collectionName.constant.js";
import { ROLES } from "../Constants/userRole.constant.js";
import authSchema from "../model/authSchema.model.js";
import {
  generateRefreshToken,
  generateToken,
  hashPassword,
  verifyPassword,
  verifyRefreshToken,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const signup = async function (req, res) {
  try {
    const user = req.body;
    console.log(req.body, "inside signup function...");
    const testUser = {
      phoneNumber: user.phoneNumber,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    // validating the input
    const result = authSchema.validate(testUser);

    if (result.error) {
      logger.error(result.error.details[0].message + " in signup function");
      return res.status(400).json({ message: result.error.details[0].message });
    }
    // check if role is valid or not
    const validRole = ROLES.includes(user.role);
    if (!validRole) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }
    const existingUser = await mdb
      .collection(`${user.role}s`)
      .findOne({ phoneNumber: user.phoneNumber });
    console.log("existing user in signup ");
    console.log(existingUser);

    if (existingUser) {
      logger.error("User already exist");
      return res
        .status(400)
        .json({ message: "User already exist...please log in " });
    }

    const hashedPassword = await hashPassword(user.password);
    console.log("hashed password ", hashedPassword);

    user.password = hashedPassword;
    console.log("user : ", user);
    const newUser = await mdb.collection(`${user.role}s`).insertOne(user);
    console.log(newUser);

    logger.info("User created successfully");
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    logger.error("Internal server error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async function (req, res) {
  try {
    const { phoneNumber, password, role } = req.body;

    // check if role is valid or not
    const validRole = ROLES.includes(role);
    if (!validRole) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }
    const existingUser = await mdb
      .collection(`${role}s`)
      .findOne({ phoneNumber });
    console.log(existingUser, " existing user inside login");

    if (!existingUser) {
      logger.error("Invalid credentials...user not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log(existingUser.password, "hashed password inside login");
    console.log(password, "normal password inside login");

    const isMatch = await verifyPassword(password, existingUser.password);

    console.log(isMatch, "is match inside login");
    if (!isMatch) {
      logger.error("Invalid credentials...password not match");
      return res
        .status(400)
        .json({ message: "Invalid credentials...password not match" });
    }

    // generating access token
    const AccessPayload = {
      phoneNumber,
      role,
      _id: existingUser._id || existingUser.id,
    };
    const token = await generateToken(AccessPayload);

    if (token) {
      res.cookie(ACCESS_TOKEN_NAME, token, ACCESS_TOKEN_EXPIRY_OPTIONS);
      logger.info("Token generation successful");
    } else {
      logger.error("Token generation failed");
      return res.status(400).json({ message: "token generation failed" });
    }
    // generating universal unique ID
    const sessionId = crypto.randomUUID();
    logger.info(`session id generated ${sessionId}`);
    // generating refresh token
    const refreshPayload = {
      phoneNumber,
      role,
      _id: existingUser._id || existingUser.id,
      sessionId,
    };

    const refreshToken = await generateRefreshToken(refreshPayload);

    if (!refreshToken) {
      logger.error("Refresh token generation failed");
      return res
        .status(400)
        .json({ message: "refresh token generation failed" });
    }
    logger.info(`Refresh token generation successful`);

    // hashing refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

    // storing refresh token in DB
    const refreshTokenObject = {
      sessionId,
      userId: existingUser._id || existingUser.id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    };
    const response = await mdb
      .collection(COLLECTION_NAMES.REFRESH_TOKEN)
      .insertOne(refreshTokenObject);

    logger.info("token stored in DB ", response);
    logger.info("Login successful");

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
    logger.error("Internal server error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async function (req, res) {
  try {
    const incomingRefreshToken = req.cookies[REFRESH_TOKEN_NAME];

    if (!incomingRefreshToken) {
      logger.warn("refresh token not found ");
      return res.status(401).json({ message: "refresh token not found " });
    }

    const user = await verifyRefreshToken(incomingRefreshToken);

    if (!user) {
      logger.warn("refresh token verification failed");
      return res
        .status(401)
        .json({ message: "refresh token verification failed" });
    }
    logger.info(`refresh token data in refreshToken : ${JSON.stringify(user)}`);
    const dbRefreshToken = await mdb
      .collection(COLLECTION_NAMES.REFRESH_TOKEN)
      .findOne({ userId: new ObjectId(user._id), sessionId: user.sessionId });

    if (!dbRefreshToken) {
      logger.error("Refresh token not found in DB");
      return res.status(401).json({ message: "Refresh token not found in DB" });
    }

    if (dbRefreshToken.expiresAt < new Date()) {
      logger.warn("refresh token expired...");

      const deleteResponse = await mdb
        .collection(COLLECTION_NAMES.REFRESH_TOKEN)
        .deleteOne({ userId: user._id, sessionId: user.sessionId });
      logger.info(" expired token deleted from DB ", deleteResponse);

      return res.status(401).json({ message: "refresh token expired..." });
    }
    const isMatch = await bcrypt.compare(
      incomingRefreshToken,
      dbRefreshToken.token,
    );

    if (!isMatch) {
      logger.error("Refresh token not matched");
      return res.status(401).json({ message: "Refresh token not matched" });
    }
    // now generating access token
    const { iat, exp, ...payload } = user;
    const accessToken = await generateToken(payload);

    if (!accessToken) {
      logger.warn("access token generation failed ");
      return res
        .status(401)
        .json({ message: "access token generation failed " });
    }

    res.cookie(ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);

    // now generating new REFRESH TOKEN
    const refreshToken = await generateRefreshToken(payload);
    if (!refreshToken) {
      logger.warn("refresh token generation failed ");
      return res
        .status(401)
        .json({ message: "refresh token generation failed " });
    }

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

    //Refresh Token Rotation
    // delete previous one and add new
    const deleteResponse = await mdb
      .collection(COLLECTION_NAMES.REFRESH_TOKEN)
      .deleteOne({ userId: user._id, sessionId: user.sessionId });
    logger.info("token deleted from DB ", deleteResponse);

    // storing refresh token in DB

    // first hash then store
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const refreshTokenObject = {
      userId: user._id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    };
    const insertResponse = await mdb
      .collection(COLLECTION_NAMES.REFRESH_TOKEN)
      .insertOne(refreshTokenObject);
    logger.info("token stored in DB ", insertResponse);

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export { signup, login, refreshToken };
