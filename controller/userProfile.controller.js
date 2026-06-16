import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "../Constants/authToken.constant.js";
import { ROLES } from "../Constants/userRole.constant.js";
import { getCollectionName } from "../helper/auth.helper.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import authSchema from "../model/authSchema.model.js";
import { deleteById, deleteOne } from "../repository/common.repository.js";
import {
  deleteRefreshToken,
  verifyRefreshToken,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";
import {
  deleteUserService,
  isUserExists,
  logoutFromAllDevicesService,
  logoutService,
} from "../service/userProfile.service.js";
import { asyncHandler } from "../util/asyncHandler.util.js";
import { db, mdb } from "../util/db.util.js";
import { ObjectId } from "mongodb";

const deleteUser = asyncHandler(async function (req, res) {
  const role = req.user.role;
  const _id = req.user._id;

  const deletedUser = deleteUserService(role, _id);

  successResponse(res, 200, "User deleted successfully", deletedUser);
});

const logout = asyncHandler(async function (req, res) {
  const user = req.user;

  const response = logoutService(user);

  res.clearCookie(ACCESS_TOKEN);
  res.clearCookie(REFRESH_TOKEN);

  successResponse(res, 200, "logout successfully", response);
});

const profile = asyncHandler(async function (req, res) {
  const user = req.user;
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
});

const logoutFromAllDevices = asyncHandler(async function (req, res) {
  const user = req.user;
  const response = logoutFromAllDevicesService(user);
  // check if user exist or not

  res.clearCookie(ACCESS_TOKEN);
  res.clearCookie(REFRESH_TOKEN);

  successResponse(res, 200, " logout successfully from all devices ", response);
});
export { deleteUser, logout, profile, logoutFromAllDevices };
