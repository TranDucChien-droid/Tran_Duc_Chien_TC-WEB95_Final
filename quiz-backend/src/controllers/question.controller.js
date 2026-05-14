import mongoose from "mongoose";
import { Question } from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";
import { parseQuestionSheet } from "../services/excelImport.service.js";

export async function createQuestion(req, res) {
  try {
    const { quizId } = req.params;
    if (!mongoose.isValidObjectId(quizId)) return res.status(400).json({ message: "Invalid quiz id" });
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const { question, type, options, correctAnswers } = req.body;
    const doc = await Question.create({ quizId, question, type, options, correctAnswers });
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid question id" });
    const { question, type, options, correctAnswers } = req.body;
    const doc = await Question.findByIdAndUpdate(
      id,
      {
        ...(question != null && { question }),
        ...(type != null && { type }),
        ...(options != null && { options }),
        ...(correctAnswers != null && { correctAnswers }),
      },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Question not found" });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid question id" });
    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Question not found" });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function importQuestions(req, res) {
  try {
    const { quizId } = req.params;
    if (!mongoose.isValidObjectId(quizId)) return res.status(400).json({ message: "Invalid quiz id" });
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    if (!req.file?.buffer) {
      return res.status(400).json({ message: "Excel file required" });
    }
    const parsed = parseQuestionSheet(req.file.buffer);
    if (!parsed.length) {
      return res.status(400).json({ message: "No valid rows found. Check columns: Question, Type, Option1-4, CorrectAnswers" });
    }
    const docs = await Question.insertMany(
      parsed.map((row) => ({
        quizId,
        question: row.question,
        type: row.type,
        options: row.options,
        correctAnswers: row.correctAnswers,
      }))
    );
    return res.status(201).json({ imported: docs.length, questions: docs });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}
