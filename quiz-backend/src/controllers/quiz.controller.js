import mongoose from "mongoose";
import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";

function stripAnswers(questionDoc) {
  const o = questionDoc.toObject ? questionDoc.toObject() : { ...questionDoc };
  delete o.correctAnswers;
  return o;
}

export async function listQuizzes(req, res) {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
    return res.json(quizzes);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function getQuizById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid quiz id" });
    const quiz = await Quiz.findById(id).lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    const questions = await Question.find({ quizId: id }).sort({ _id: 1 });
    const isAdmin = req.user?.role === "admin";
    const qPayload = isAdmin ? questions.map((q) => q.toObject()) : questions.map(stripAnswers);
    return res.json({ ...quiz, questions: qPayload });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function createQuiz(req, res) {
  try {
    const { title, description } = req.body;
    const quiz = await Quiz.create({
      title,
      description: description ?? "",
      createdBy: req.user.id,
    });
    return res.status(201).json(quiz);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function updateQuiz(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid quiz id" });
    const { title, description } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { ...(title != null && { title }), ...(description != null && { description }) },
      { new: true }
    );
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    return res.json(quiz);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function deleteQuiz(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid quiz id" });
    const deleted = await Quiz.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Quiz not found" });
    await Question.deleteMany({ quizId: id });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}
