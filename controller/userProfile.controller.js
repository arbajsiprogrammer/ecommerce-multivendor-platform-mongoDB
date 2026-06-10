import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "../Constants/authToken.consts.js";
import authSchema from "../model/authSchema.model.js";
import {
  generateRefreshToken,
  generateToken,
  hashPassword,
  verifyPassword,
  verifyRefreshToken,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";

const deleteUser = async function (req, res) {
  try {
    const role = req.user.role;
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
    const _id = req.user._id;

    const existingUser = await mdb
      .collection(`${role}s`)
      .findOne({ _id: new ObjectId(_id) });

    if (!existingUser) {
      logger.error("User not found");
      return res.status(400).json({ message: "user not found" });
    }

    res.clearCookie(ACCESS_TOKEN_NAME);
    res.clearCookie(REFRESH_TOKEN_NAME);

    // verifying cookie deletion
    console.log("ACCESS_TOKEN_NAME : ", res.cookie(ACCESS_TOKEN_NAME));
    console.log("REFRESH_TOKEN_NAME : ", res.cookie(REFRESH_TOKEN_NAME));
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
    return res.status(200).json({ user: existingUser });
  } catch (error) {
    logger.error("Internal server error " + error.message);
    console.log(error);
    return res
      .status(500)
      .json({ message: "error inside profile function..." + error.message });
  }
};

export { deleteUser, logout, profile };
