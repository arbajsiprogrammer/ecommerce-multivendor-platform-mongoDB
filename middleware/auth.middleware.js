import { verifyToken } from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { ACCESS_TOKEN } from "../Constants/authToken.constant.js";
import authSchema from "../model/authSchema.model.js";
import { errorResponse } from "../helper/response.helper.js";
import { ROLES } from "../Constants/userRole.constant.js";
import { ApiError } from "../util/ApiError.util.js";
import { asyncHandler } from "../util/asyncHandler.util.js";

const verifyAuthToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies[ACCESS_TOKEN];

  let user = null;
  if (!token) {
    throw new ApiError(401, "Access token not found");
  }

  user = await verifyToken(token);

  if (!user) {
    throw new ApiError(401, "Access token verification failed from middleware");
  }

  req.user = user;
  req.userId = user._id;

  next();
});

const validateSignup = (req, res, next) => {
  const user = req.body;

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
    throw new ApiError(400, result.error.details[0].message);
  }

  next();
};

const validateRole = (req, res, next) => {
  const user = req.user || req.body;

  // check if role is valid or not
  const validRole = ROLES.includes(user.role);

  if (!validRole) {
    throw new ApiError(400, "Invalid role");
  }

  next();
};

export { verifyAuthToken, validateRole, validateSignup };
