import { ref, required, string } from "joi";
import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "user",
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      required: true,
    },
  },
  { timestamps: true },
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
