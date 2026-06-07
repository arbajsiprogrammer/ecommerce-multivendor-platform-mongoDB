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

    // validating the input
    const result = authSchema.validate(user);

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

const deleteUser = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const _id = req.user._id;

    const existingUser = await mdb
      .collection(`${role}s`)
      .findOne({ _id: new ObjectId(_id) });
    console.log("existingUser inside delete user ");
    console.log(existingUser);

    if (!existingUser) {
      logger.error("User not found");
      return res.status(400).json({ message: "user not found" });
    }

    if (role) {
      const deletedUser = await mdb
        .collection(`${role}s`)
        .deleteOne({ _id: new ObjectId(_id) });
      console.log(deletedUser);

      logger.info("User deleted successfully");
      return res.status(200).json({ message: "deleted successfully " });
    }
  } catch (error) {
    logger.error("Internal server error");
    return res.status(500).json({ message: error.message });
  }
};

const logout = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const _id = req.user._id;

    const existingUser = await mdb
      .collection(`${role}s`)
      .find({ _id: new ObjectId(_id) })
      .toArray();

    if (existingUser.length == 0) {
      logger.error("User not found");
      return res.status(400).json({ message: "user not found" });
    }

    res.clearCookie("token");
    res.clearCookie("refreshToken");
    logger.info("Logout successful");

    return res.status(200).json({ message: "logout successfully " });
  } catch (error) {
    console.log(error);
    logger.error("Internal server error " + error.message);
    return res.status(500).json({ message: error.message });
  }
};

const profile = async function (req, res) {
  try {
    const id = req.user._id;
    console.log("id : ", id);
    const role = req.user.role;

    const existingUser = await mdb
      .collection(`${role}s`)
      .findOne({ _id: new ObjectId(id) });
    console.log(existingUser, " inside profile ");

    if (!existingUser) {
      logger.error("User not found");
      return res.status(400).json({ message: "user not found" });
    }

    logger.info("Profile data retrieved successfully");
    return res.status(200).json({ existingUser: existingUser });
  } catch (error) {
    logger.error("Internal server error " + error.message);
    console.log(error);
    return res
      .status(500)
      .json({ message: "error inside profile function..." + error.message });
  }
};

export { signup, login, logout, profile, deleteUser };
