import { ObjectId } from "mongodb";
import { mdb } from "../util/db.util.js";
import { findById, findOne } from "../repository/common.repository.js";
import COLLECTION from "../Constants/collectionName.constant.js";

const isUserExists = async (_id, role) => {
  const name = getCollectionName(role);

  const existingUser = await findById(name, { _id });

  if (!existingUser) {
    throw new Error("user not found");
  }

  return existingUser;
};

const getCollectionName = (role, _id) => {
  if (role == "admin" || role == "vendor") {
    return COLLECTION.PLATFORM_USER;
  } else {
    return COLLECTION.CUSTOMER;
  }
};
export { isUserExists, getCollectionName };
