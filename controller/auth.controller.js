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
import { ApiError } from "../util/ApiError.util.js";
import { asyncHandler } from "../util/asyncHandler.util.js";

const signup = asyncHandler(async function (req, res) {
  const user = req.body;

  const response = await signUpService(user);

  successResponse(res, 200, "User created successfully", response);
});

const login = asyncHandler(async function (req, res) {
  const { accessToken, refreshToken } = await loginService(req.body);

  // store tokens into the cookies
  res.cookie(ACCESS_TOKEN, accessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);
  res.cookie(REFRESH_TOKEN, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

  successResponse(res, 200, "Login successful");
});

const refreshToken = asyncHandler(async function (req, res) {
  const incomingRefreshToken = req.cookies[REFRESH_TOKEN];

  if (!incomingRefreshToken) {
    throw new ApiError(401, "refresh token not found ");
  }

  const { accessToken, refreshToken } =
    await refreshTokenService(incomingRefreshToken);

  res.cookie(ACCESS_TOKEN, accessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);
  res.cookie(REFRESH_TOKEN, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

  successResponse(res, 200, "Token refreshed successfully", {
    accessToken,
    refreshToken,
  });
});

export { signup, login, refreshToken };
