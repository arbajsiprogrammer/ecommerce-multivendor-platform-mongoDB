import {
  generateToken,
  verifyRefreshToken,
  verifyToken,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { ACCESS_TOKEN } from "../Constants/authToken.constant.js";
import authSchema from "../model/authSchema.model.js";
import { errorResponse } from "../helper/response.helper.js";
import { ROLES } from "../Constants/userRole.constant.js";

const verifyAuthToken = async (req, res, next) => {
  try {
    console.log("inside verifyAuthToken");
    const token = req.cookies[ACCESS_TOKEN];
    console.log(token, "inside verify Auth Token");

    let user = null;
    if (!token) {
      logger.error(" Access token not found ");
      return res.status(401).json({ message: " Access token not found " });
    }

    user = await verifyToken(token);

    if (!user) {
      logger.error("Access token verification failed");
      return res
        .status(401)
        .json({ message: "Access token verification failed" });
    }

    if (user) {
      req.user = user;
      req.userId = user._id;
      return next();
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const validateSignup = async (req, res, next) => {
  try {
    const user = req.body;
    logger.info(req.body, "inside validateSignup middleware...");

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
      logger.error(
        result.error.details[0].message + " in validateSignup middleware",
      );
      errorResponse(res, 400, result.error.details[0].message);
    }

    next();
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const validateRole = async (req, res, next) => {
  try {
    const user = req.body;
    // check if role is valid or not
    const validRole = ROLES.includes(user.role);

    if (!validRole) {
      return res.status(400).json({
        message: "Invalid role",
      });
      errorResponse(res, 400, "Invalid role");
    }
    next();
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export { verifyAuthToken, validateRole, validateSignup };
