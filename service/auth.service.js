import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../Constants/authToken.constant.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
const refresh_secretKey = process.env.JWT_REFRESH_SECRET_KEY;

// generating JWT access token
const generateToken = async (payload) => {
  return await jwt.sign(payload, secretKey, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const verifyToken = async (token) => {
  try {
    console.log("secretKey", secretKey);
    const user = await jwt.verify(token, secretKey);
    console.log(user, "*********user inside verify token ");
    return user;
  } catch (error) {
    console.log(error);
  }
};

// generating JWT refresh token
const generateRefreshToken = async (payload) => {
  return await jwt.sign(payload, refresh_secretKey, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const verifyRefreshToken = async (token) => {
  try {
    console.log("refresh_secretKey", refresh_secretKey);
    const user = await jwt.verify(token, refresh_secretKey);
    console.log(user, "*********user inside verify refresh token ");
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
// hashing password
const hashPassword = async function (password) {
  try {
    const hashed = await bcrypt.hash(password, 10);
    console.log(hashed, "inside hash password service");
    return hashed;
  } catch (error) {
    console.log(error);
  }
};

const verifyPassword = async function (password, hashed_password) {
  try {
    const isMatch = await bcrypt.compare(password, hashed_password);
    console.log(isMatch, "inside verify password service");
    return isMatch;
  } catch (error) {
    console.error(error);
  }
};

export {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
  verifyPassword,
};
