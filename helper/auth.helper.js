import { error } from "winston";
import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";

const deleteRefreshToken = async (user) => {
  const deleteResponse = await mdb
    .collection(COLLECTION.REFRESH_TOKEN)
    .deleteOne({ userId: user._id, sessionId: user.sessionId });
  logger.info("token deleted from DB ", deleteResponse);
};

const storeRefreshToken = async function (payload, refreshToken) {
  // hashing refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  // generating universal unique ID for identifying refresh token from db
  const sessionId = crypto.randomUUID();

  // storing refresh token in DB
  const refreshTokenObject = {
    sessionId,
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
    throw new error(
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
    throw new error("Refresh token not found in DB");
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

    throw new error("refresh token expired...");
  }

  return dbRefreshToken;
};

export { deleteRefreshToken, storeRefreshToken, getRefreshToken };
