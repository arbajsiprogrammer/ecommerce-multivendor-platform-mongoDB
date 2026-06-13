import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRY_OPTIONS,
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRY_OPTIONS,
} from "../Constants/authToken.constant.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import {
  loginService,
  refreshTokenService,
  signUpService,
} from "../service/auth.service.js";

const signup = async function (req, res) {
  try {
    const user = req.body;

    const response = await signUpService(user);

    successResponse(res, 200, "User created successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error);
  }
};

const login = async function (req, res) {
  try {
    const { accessToken, refreshToken } = await loginService(req.body);

    // store tokens into the cookies
    res.cookie(ACCESS_TOKEN, accessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);
    res.cookie(REFRESH_TOKEN, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

    successResponse(res, 200, "Login successful");
  } catch (error) {
    return errorResponse(res, 500, error);
  }
};

const refreshToken = async function (req, res) {
  try {
    const incomingRefreshToken = req.cookies[REFRESH_TOKEN];

    if (!incomingRefreshToken) {
      return errorResponse(res, 400, "refresh token not found ");
    }

    const { accessToken, refreshToken } =
      await refreshTokenService(incomingRefreshToken);

    res.cookie(ACCESS_TOKEN, accessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);
    res.cookie(REFRESH_TOKEN, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

    successResponse(res, 200, "Token refreshed successfully", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return errorResponse(res, 500, error);
  }
};

export { signup, login, refreshToken };
