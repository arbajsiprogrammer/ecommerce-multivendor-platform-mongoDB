import {
  ACCESS_TOKEN_EXPIRY_OPTIONS,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_EXPIRY_OPTIONS,
  REFRESH_TOKEN_NAME,
} from "../Constants/authToken.constant.js";
import { ROLES } from "../Constants/userRole.constant.js";
import authSchema from "../model/authSchema.model.js";
import {
  generateRefreshToken,
  generateToken,
  hashPassword,
  verifyPassword,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";

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

    const existingUser = await mdb
      .collection(`${user.role}s`)
      .findOne({ phoneNumber: user.phoneNumber });
    console.log("existing user in signup ");
    console.log(existingUser);

    if (!existingUser) {
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
    let payload = {
      phoneNumber,
      role,
      _id: existingUser._id || existingUser.id,
    };
    const token = await generateToken(payload);

    if (token) {
      res.cookie(ACCESS_TOKEN_NAME, token, ACCESS_TOKEN_EXPIRY_OPTIONS);
      logger.info("Token generation successful");
    } else {
      logger.error("Token generation failed");
      return res.status(400).json({ message: "token generation failed" });
    }

    // generating refresh token
    payload = {
      phoneNumber,
      role,
      _id: existingUser._id || existingUser.id,
    };

    const refreshToken = await generateRefreshToken(payload);

    if (refreshToken) {
      res.cookie(
        REFRESH_TOKEN_NAME,
        refreshToken,
        REFRESH_TOKEN_EXPIRY_OPTIONS,
      );

      logger.info("Refresh token generation successful");
    } else {
      logger.error("Refresh token generation failed");
      return res
        .status(400)
        .json({ message: "refresh token generation failed" });
    }

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
    // now generating access token
    const accessToken = await generateToken(user);

    if (!accessToken) {
      logger.warn("access token generation failed ");
      return res
        .status(401)
        .json({ message: "access token generation failed " });
    }

    res.cookie(ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_EXPIRY_OPTIONS);

    // now generating new REFRESH TOKEN
    const refreshToken = await generateRefreshToken(user);
    if (!refreshToken) {
      logger.warn("refresh token generation failed ");
      return res
        .status(401)
        .json({ message: "refresh token generation failed " });
    }

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, REFRESH_TOKEN_EXPIRY_OPTIONS);

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export { signup, login, refreshToken };
