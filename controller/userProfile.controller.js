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

export { deleteUser, logout, profile };
