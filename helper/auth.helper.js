import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";
import bcrypt from "bcryptjs";
import logger from "../service/log.service.js";
import { ObjectId } from "mongodb";

const deleteRefreshToken = async (user) => {
  const deleteResponse = await mdb
    .collection(COLLECTION.REFRESH_TOKEN)
    .deleteOne({ userId: user._id, sessionId: user.sessionId });
  logger.info("token deleted from DB ", deleteResponse);
};

const storeRefreshToken = async function (payload, refreshToken) {
  // hashing refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  // storing refresh token in DB
  const refreshTokenObject = {
    sessionId: payload.sessionId,
    userId: payload._id,
    token: hashedRefreshToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  };

  const response = await mdb
    .collection(COLLECTION.REFRESH_TOKEN)
    .insertOne(refreshTokenObject);

  if (response) {
    logger.info(`refresh token stored in DB ${JSON.stringify(response)}`);
  } else {
    throw new Error(
      ` failed to store refresh token in DB ${JSON.stringify(response)}`,
    );
  }
};

const getRefreshToken = async (user) => {
  // get token from DB
  const dbRefreshToken = await mdb
    .collection(COLLECTION.REFRESH_TOKEN)
    .findOne({ sessionId: user.sessionId, userId: new ObjectId(user._id) });

  if (!dbRefreshToken) {
    throw new Error("Refresh token not found in DB");
  }

  //   check expiry
  if (dbRefreshToken.expiresAt < new Date()) {
    // delete expired token
    const deleteResponse = await mdb
      .collection(COLLECTION.REFRESH_TOKEN)
      .deleteOne({ userId: user._id, sessionId: user.sessionId });

    logger.info(
      " expired token deleted from DB ",
      JSON.stringify(deleteResponse),
    );

    throw new Error("refresh token expired...");
  }

  return dbRefreshToken;
};

export { deleteRefreshToken, storeRefreshToken, getRefreshToken };
