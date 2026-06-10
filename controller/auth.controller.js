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
      .find({ phoneNumber: user.phoneNumber })
      .toArray();
    console.log("existing user in signup ");
    console.log(existingUser);

    if (existingUser.length > 0) {
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

    const existingUser = await mdb
      .collection(`${role}s`)
      .find({ phoneNumber })
      .toArray();
    console.log(existingUser, " existing user inside login");

    if (existingUser.length == 0) {
      logger.error("Invalid credentials...user not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log(existingUser[0].password, "hashed password inside login");
    console.log(password, "normal password inside login");

    const isMatch = await verifyPassword(password, existingUser[0].password);

    console.log(isMatch, "is match inside login");
    if (!isMatch) {
      logger.error("Invalid credentials...password not match");
      return res
        .status(400)
        .json({ message: "Invalid credentials...password not match" });
    }

    // generating access token
    const token = await generateToken({
      phoneNumber,
      role,
      _id: existingUser[0]._id || existingUser[0].id,
    });

    if (token) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 10, // 10 minutes
      });

      logger.info("Token generation successful");
    } else {
      logger.error("Token generation failed");
      return res.status(400).json({ message: "token generation failed" });
    }

    // generating refresh token
    const refreshToken = await generateRefreshToken({
      phoneNumber,
      role,
      _id: existingUser[0]._id || existingUser[0].id,
    });

    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

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

export { signup, login };
