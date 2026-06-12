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
  hashPassword,
  rotateRefreshToken,
  createTokens,
  verifyPassword,
  verifyRefreshToken,
  getRoleId,
  createUser,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";
import { errorResponse, successResponse } from "../helper/response.helper.js";

const signup = async function (req, res) {
  try {
    const user = req.body;

    // check if user exist
    const existingUser = await findUserByPhone(user.role, user.phoneNumber);

    if (existingUser) {
      return errorResponse(res, 400, " User already exist...please log in ");
    }
    // hash password
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;

    const roleId = await getRoleId(user.role);
    user.roleId = roleId;

    // create new user
    const response = await createUser(user);

    successResponse(res, 200, "User created successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const login = async function (req, res) {
  try {
    const { phoneNumber, password, role } = req.body;

    const existingUser = await findUserByPhone(role, phoneNumber);

    if (!existingUser) {
      return errorResponse(res, 400, "Invalid credentials...user not found");
    }

    const isMatch = await verifyPassword(password, existingUser.password);

    if (!isMatch) {
      return errorResponse(
        res,
        400,
        "Invalid credentials...password not match",
      );
    }

    // store access token and refresh token into the cookies
    const payload = {
      phoneNumber,
      role,
      roleId: existingUser.roleId,
      _id: existingUser._id,
    };
    const { accessToken, refreshToken } = await createTokens(payload);
    console.error("AccessToken", accessToken, "refreshToken", refreshToken);
    // store tokens into the cookies
    res.cookie(ACCESS_TOKEN, accessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);
    res.cookie(REFRESH_TOKEN, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

    successResponse(res, 200, "Login successful", existingUser);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const refreshToken = async function (req, res) {
  try {
    const incomingRefreshToken = req.cookies[REFRESH_TOKEN];

    if (!incomingRefreshToken) {
      return errorResponse(res, 400, "refresh token not found ");
    }

    const user = await verifyRefreshToken(incomingRefreshToken);

    // now generating access token
    const { accessToken, refreshToken } = await generateNewTokens(user);

    //Refresh Token Rotation
    await rotateRefreshToken(user, refreshToken);

    res.cookie(ACCESS_TOKEN, accessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);
    res.cookie(REFRESH_TOKEN, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

    successResponse(res, 200, "Token refreshed successfully", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export { signup, login, refreshToken };
