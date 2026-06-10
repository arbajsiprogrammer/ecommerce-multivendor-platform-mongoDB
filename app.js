import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";
import { connectDB, connectMongo } from "./util/db.util.js";
import { db } from "./util/db.util.js";
import apiRoute from "./route/api.route.js";
import cors_options from "./service/cors.service.js";

const app = express();

app.use(cors(cors_options));
app.use(express.json());
app.use(cookieParser());

// mounting routes
app.use("/api/v1", apiRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
  res.status(200).json({ message: "Server is running" });
});

// connectDB();
connectMongo();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
