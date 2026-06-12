import mongoose from "mongoose";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let db;

const connectDB = async function () {
  // db = await mysql.createConnection({
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
  // });

  db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,

    ssl: {
      rejectUnauthorized: false,
    },
  });

  console.log(":db connected");
};

let mdb;

const connectMongo = async function () {
  try {
    const URI = process.env.MONGODB_URI;
    const response = await mongoose.connect(URI);
    mdb = await mongoose.connection.db;
    console.log("db connected", mdb.databaseName);
    // mdb./;
  } catch (error) {
    console.log(error);
  }
};

export { connectDB, db, connectMongo, mdb };
