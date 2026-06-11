import {
  ACCESS_TOKEN_EXPIRY_OPTIONS,
  ACCESS_TOKEN,
  REFRESH_TOKEN_EXPIRY_OPTIONS,
  REFRESH_TOKEN,
} from "../Constants/authToken.constant.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import { ROLES } from "../Constants/userRole.constant.js";
import authSchema from "../model/authSchema.model.js";
import {
  findUserByPhone,
  generateNewTokens,
  generateRefreshToken,
  generateToken,
  hashPassword,
  rotateRefreshToken,
  storeTokens,
  verifyPassword,
  verifyRefreshToken,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { errorResponse, successResponse } from "../helper/response.helper.js";

const signup = async function (req, res) {
  try {
    const user = req.body;

    // check if user exist
    const existingUser = await findUserByPhone(user.role, user.phoneNumber);

    if (existingUser) {
      errorResponse(res, 400, " User already exist...please log in ");
    }
    // hash password
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;

    // create new user
    const newUser = await mdb.collection(`${user.role}s`).insertOne(user);

    successResponse(res, 200, "User created successfully", newUser);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const login = async function (req, res) {
  try {
    const { phoneNumber, password, role } = req.body;

    const existingUser = findUserByPhone(role, phoneNumber);
    if (!existingUser) {
      errorResponse(res, 400, "Invalid credentials...user not found");
    }

    const isMatch = await verifyPassword(password, existingUser.password);
    if (!isMatch) {
      errorResponse(res, 400, "Invalid credentials...password not match");
    }

    // store access token and refresh token into the cookies
    const payload = {
      phoneNumber,
      role,
      _id: existingUser._id,
    };
    storeTokens(res, payload);

    successResponse(res, 200, "Login successful", existingUser);
  } catch (error) {
    console.log(error);
    logger.error("Internal server error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async function (req, res) {
  try {
    const incomingRefreshToken = req.cookies[REFRESH_TOKEN];
    if (!incomingRefreshToken) {
      errorResponse(res, 400, "refresh token not found ");
    }

    const user = await verifyRefreshToken(incomingRefreshToken);

    // now generating access token
    const { accessToken, refreshToken } = generateNewTokens(user);

    //Refresh Token Rotation
    rotateRefreshToken(user, refreshToken);

    res.cookie(ACCESS_TOKEN, accessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);
    res.cookie(REFRESH_TOKEN, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export { signup, login, refreshToken };
