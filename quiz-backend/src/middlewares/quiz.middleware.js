import { body, param } from "express-validator";
import { requireAdmin, requireAuth } from "./auth.middleware.js";
import { handleValidation } from "./validate.middleware.js";

export function quizAuthenticatedChain() {
  return [requireAuth];
}

export function quizGetByIdChain() {
  return [param("id").isMongoId(), handleValidation];
}

export function quizCreateChain() {
  return [
    requireAdmin,
    body("title").isString().trim().notEmpty(),
    body("description").optional().isString(),
    handleValidation,
  ];
}

export function quizUpdateChain() {
  return [
    requireAdmin,
    param("id").isMongoId(),
    body("title").optional().isString().trim().notEmpty(),
    body("description").optional().isString(),
    handleValidation,
  ];
}

export function quizDeleteChain() {
  return [requireAdmin, param("id").isMongoId(), handleValidation];
}
