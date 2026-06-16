import { getCollectionName } from "../helper/auth.helper.js";
import logger from "../service/log.service.js";
import { mdb } from "../util/db.util.js";
import { findOne } from "./common.repository.js";

const findUserByPhone = async (collectionName, phoneNumber) => {
  // check if user is already exist or not

  const existingUser = await mdb
    .collection(collectionName)
    .findOne({ phoneNumber });

  logger.warn(
    `existing user in findUserByPhone ${JSON.stringify(existingUser)}`,
  );

  return existingUser;
};

export { findUserByPhone };
