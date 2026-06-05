import mongoose from "mongoose";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let mdb;
const URI = process.env.MONGODB_URI;
const connectMongo = async function () {
  try {
    const response = await mongoose.connect(URI);
    mdb = mongoose.connection.db;
    console.log("db connected", mdb.databaseName);
    createSparseIndex();
    // mdb./;
  } catch (error) {
    console.log(error);
  }
};

const createSparseIndex = async () => {
  try {
    const collections = await mdb.listCollections().toArray();
    console.log(collections);

    for (const c of collections) {
      const indexes = await mdb.collection(c.name).indexes();
      console.log(`index of ${c.name}`);
      console.log(indexes);
      const index = indexes.filter((idx) => idx.key.id);
      console.log(index);

      index.map((idx) => {
        removeIndex(idx, c.name);
      });

      // creating index on id for the existing migrated data from mysql

      await mdb.collection(c.name).createIndex(
        {
          id: 1,
        },
        {
          unique: true,
          sparse: true,
        },
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const removeIndex = async function (idx, collectionName) {
  try {
    const response = await mdb.collection(collectionName).dropIndex(idx.name);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
};

connectMongo();

// created this file because
// when i migrated from  mysql to mongoDB
// unique index of id is created by default
// so to remove the unique index and create the sparse unique index i created this file

//  i have executed this file once so that even if i do not insert the id into the new data it will be the ok (no error)
