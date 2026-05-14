import { body } from "express-validator";
import { requireAuth } from "./auth.middleware.js";
import { handleValidation } from "./validate.middleware.js";

export function attemptAuthenticatedChain() {
  return [requireAuth];
}

export function attemptSubmitChain() {
  return [
    body("quizId").isMongoId(),
    body("answers").isArray(),
    body("answers.*.questionId").isMongoId(),
    body("answers.*.selectedIndexes").isArray(),
    body("answers.*.selectedIndexes.*").optional().isInt({ min: 0 }),
    handleValidation,
  ];
}
