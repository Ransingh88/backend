import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz.questions",
          required: true,
          unique: true,
        },
        selectedOption: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Response = mongoose.model("Response", responseSchema);
