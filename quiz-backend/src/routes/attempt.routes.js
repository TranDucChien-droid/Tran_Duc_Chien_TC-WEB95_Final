import { Router } from "express";
import { body } from "express-validator";
import * as attemptController from "../controllers/attempt.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { handleValidation } from "../middlewares/validate.middleware.js";

const router = Router();
router.use(requireAuth);

router.post(
  "/",
  [
    body("quizId").isMongoId(),
    body("answers").isArray(),
    body("answers.*.questionId").isMongoId(),
    body("answers.*.selectedIndexes").isArray(),
    body("answers.*.selectedIndexes.*").optional().isInt({ min: 0 }),
  ],
  handleValidation,
  attemptController.submitAttempt
);

router.get("/me", attemptController.listMyAttempts);

export default router;
