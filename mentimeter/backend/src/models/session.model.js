import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    sessionCode: { type: String, unique: true, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
