import { verifyToken } from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { ACCESS_TOKEN } from "../Constants/authToken.constant.js";
import authSchema from "../model/authSchema.model.js";
import { errorResponse } from "../helper/response.helper.js";
import { ROLES } from "../Constants/userRole.constant.js";

const verifyAuthToken = async (req, res, next) => {
  try {
    const token = req.cookies[ACCESS_TOKEN];
    console.log(token, "token  inside verifyAuthToken");
    let user = null;
    if (!token) {
      return errorResponse(res, 401, "Access token not found");
    }

    user = await verifyToken(token);
    console.log(user, "user inside verifyAuthToken");

    if (!user) {
      return errorResponse(
        res,
        401,
        "Access token verification failed from middleware" + user,
      );
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const validateSignup = async (req, res, next) => {
  try {
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
      return errorResponse(res, 400, result.error.details[0].message);
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, error);
  }
};

const validateRole = async (req, res, next) => {
  try {
    const user = req.user || req.body;

    // check if role is valid or not
    const validRole = ROLES.includes(user.role);

    if (!validRole) {
      return errorResponse(res, 400, "Invalid role");
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, error);
  }
};

export { verifyAuthToken, validateRole, validateSignup };
