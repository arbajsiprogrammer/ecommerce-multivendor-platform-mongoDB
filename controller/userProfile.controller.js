import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "../Constants/authToken.constant.js";
import { ROLES } from "../Constants/userRole.constant.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import authSchema from "../model/authSchema.model.js";
import {
  hashPassword,
  verifyPassword,
  verifyRefreshToken,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { isUserExists } from "../service/userProfile.service.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";

const deleteUser = async function (req, res) {
  try {
    const user = req.user;
    const role = req.user.role;
    const _id = req.user._id;

    await isUserExists(_id, role);

    if (role) {
      const deletedUser = await mdb
        .collection(`${role}s`)
        .deleteOne({ _id: new ObjectId(_id) });

      successResponse(res, 200, "User deleted successfully", deleteUser);
    }
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const logout = async function (req, res) {
  try {
    const user = req.user;
    const role = req.user.role;
    const _id = req.user._id;
    // check if user exist or not
    await isUserExists(_id, role);

    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(REFRESH_TOKEN);

    successResponse(res, 200, "logout successfully", null);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const profile = async function (req, res) {
  try {
    const user = req.user;
    console.log("*********", req.user);
    const _id = user._id;
    const role = user.role;

    // check if user exist or not
    const existingUser = await isUserExists(_id, role);

    successResponse(
      res,
      200,
      "Profile data retrieved successfully",
      existingUser,
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const logoutFromAllDevices = async function (req, res) {
  try {
    const user = req.user;
    const role = req.user.role;
    const _id = req.user._id;

    // check if user exist or not
    await isUserExists(_id, role);

    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(REFRESH_TOKEN);

    const deleteResponse = await mdb
      .collection(COLLECTION.REFRESH_TOKEN)
      .deleteMany({ userId: user._id });

    successResponse(
      res,
      200,
      " logout successfully from all devices ",
      existingUser,
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
export { deleteUser, logout, profile, logoutFromAllDevices };
