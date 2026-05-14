import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
