import { mdb } from "../util/db.util.js";

const insertOne = async (collectionName, data) => {
  try {
    const response = await mdb.collection(collectionName).insertOne(data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findOne = async (collectionName, fields) => {
  const response = await mdb.collection(collectionName).findOne(fields);
  if (!response) {
    throw new Error("Refresh token not found in DB");
  }
  return response;
};

const deleteOne = async (collectionName, fields) => {
  const response = await mdb.collection(collectionName).deleteOne(fields);

  return response;
};

export { findOne, insertOne, deleteOne };
