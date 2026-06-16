import { ObjectId } from "mongodb";
import { mdb } from "../util/db.util.js";
import {
  deleteById,
  deleteMany,
  findById,
  findOne,
} from "../repository/common.repository.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import { getCollectionName } from "../helper/auth.helper.js";
import { deleteRefreshToken } from "./auth.service.js";

const isUserExists = async (_id, role) => {
  const name = getCollectionName(role);

  const existingUser = await findById(name, { _id });

  return existingUser;
};

const deleteUserService = async (role, _id) => {
  await isUserExists(_id, role);

  const collectionName = await getCollectionName(role);

  const deletedUser = await deleteById(collectionName, { _id });
  return deletedUser;
};

const logoutService = async (user) => {
  const role = user.role;
  const _id = user._id;

  // check if user exist or not
  await isUserExists(_id, role);

  // delete refresh token from DB
  await deleteRefreshToken(user);
};

const logoutFromAllDevicesService = async (user) => {
  const role = req.user.role;
  const _id = req.user._id;

  await isUserExists(_id, role);

  const response = await deleteMany(COLLECTION.REFRESH_TOKEN, {
    userId: user._id,
  });

  return response;
};
export {
  isUserExists,
  deleteUserService,
  logoutService,
  logoutFromAllDevicesService,
};
