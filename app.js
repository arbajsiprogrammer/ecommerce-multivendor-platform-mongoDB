import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";
import { connectDB, connectMongo } from "./util/db.util.js";
import { db } from "./util/db.util.js";
import apiRoute from "./route/api.route.js";
import cors_options from "./service/cors.service.js";
import { errorResponse } from "./helper/response.helper.js";
import { createRoles } from "./util/role.util.js";

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
// createRoles();
// unknown routes handler
app.use((req, res) => {
  return errorResponse(res, 404, "route not found 404");
});

// global error handler
app.use((error, req, res, next) => {
  return errorResponse(res, 500, error || "internal server error ");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
