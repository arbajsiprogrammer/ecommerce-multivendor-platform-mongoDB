import { ObjectId } from "mongodb";
import { mdb } from "../util/db.util.js";
import { ApiError } from "../util/ApiError.util.js";

const insertOne = async (collectionName, data) => {
  try {
    const response = await mdb
      .collection(collectionName)
      .insertOne({ ...data });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const findOne = async (collectionName, fields) => {
  const response = await mdb.collection(collectionName).findOne({ ...fields });

  if (!response) {
    throw new Error(
      `data not found in DB for fields ${JSON.stringify(fields)}`,
    );
  }
  return response;
};

const find = async (collectionName, fields = {}) => {
  const response = await mdb
    .collection(collectionName)
    .find({ ...fields })
    .toArray();

  if (response.length == 0) {
    throw new ApiError(
      404,
      `data not found in DB for fields ${JSON.stringify(fields)}`,
    );
  }
  return response;
};

const deleteOne = async (collectionName, fields) => {
  const response = await mdb
    .collection(collectionName)
    .deleteOne({ ...fields });

  return response;
};

const deleteById = async (collectionName, fields) => {
  fields._id = new ObjectId(fields._id);

  const response = await mdb
    .collection(collectionName)
    .deleteOne({ ...fields });

  return response;
};

const findById = async (collectionName, fields) => {
  if (!fields || !fields._id) {
    throw new Error("please provide valid Id");
  }
  fields._id = new ObjectId(fields._id);

  const response = await mdb.collection(collectionName).findOne({ ...fields });

  if (!response) {
    throw new Error(
      `data not found in DB for fields ${JSON.stringify(fields)}`,
    );
  }

  return response;
};

const updateOne = async (collectionName, findFields, setFields) => {
  const response = await mdb.collection(collectionName).updateOne(
    { ...findFields },
    {
      $set: { ...setFields },
    },
  );
  return response;
};

const aggregation = async (collectionName, stageArray) => {
  const response = await mdb
    .collection(collectionName)
    .aggregate([...stageArray])
    .toArray();

  return response;
};
export {
  findOne,
  insertOne,
  deleteOne,
  findById,
  deleteById,
  find,
  updateOne,
  aggregation,
};
