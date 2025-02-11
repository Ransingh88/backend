import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz.questions",
          required: true,
        },
        selectedOption: { type: String },
        ansResponseTime: { type: String },
        ansSubmitTime: { type: String },
        isAnsCorrect: { type: String },
        points: { type: Number },
      },
    ],
    leaderBoard: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Response = mongoose.model("Response", responseSchema);
