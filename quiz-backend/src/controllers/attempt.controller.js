import mongoose from "mongoose";
import { Attempt } from "../models/attempt.model.js";
import { Question } from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";
import { scoreAttempt } from "../services/attemptScore.service.js";

export async function submitAttempt(req, res) {
  try {
    const { quizId, answers } = req.body;
    if (!mongoose.isValidObjectId(quizId)) return res.status(400).json({ message: "Invalid quiz id" });
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    const questions = await Question.find({ quizId }).sort({ _id: 1 });
    if (!questions.length) return res.status(400).json({ message: "Quiz has no questions" });

    const normalized = (answers || []).map((a) => ({
      questionId: String(a.questionId),
      selectedIndexes: Array.isArray(a.selectedIndexes) ? a.selectedIndexes.map(Number) : [],
    }));

    const { score, correct, total } = scoreAttempt(questions, normalized);

    const attempt = await Attempt.create({
      userId: req.user.id,
      quizId,
      answers: normalized.map((a) => ({
        questionId: a.questionId,
        selectedIndexes: a.selectedIndexes,
      })),
      score,
    });

    return res.status(201).json({
      attemptId: attempt._id,
      score,
      correct,
      total,
      createdAt: attempt.createdAt,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function listMyAttempts(req, res) {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("quizId", "title")
      .lean();
    return res.json(attempts);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}
