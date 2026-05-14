import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    question: { type: String, required: true, trim: true },
    type: { type: String, enum: ["single", "multiple"], required: true },
    options: [{ type: String, required: true }],
    correctAnswers: [{ type: Number, required: true }],
  },
  { versionKey: false }
);

export const Question = mongoose.model("Question", questionSchema);
