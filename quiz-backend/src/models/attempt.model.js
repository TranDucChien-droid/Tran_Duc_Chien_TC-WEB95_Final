import mongoose from "mongoose";

const answerItemSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    selectedIndexes: [{ type: Number }],
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    answers: { type: [answerItemSchema], default: [] },
    score: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const Attempt = mongoose.model("Attempt", attemptSchema);
