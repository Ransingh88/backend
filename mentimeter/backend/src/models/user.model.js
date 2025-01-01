import mongoose from "mongoose";

const useSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["presenter", "participant"] },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", useSchema);
