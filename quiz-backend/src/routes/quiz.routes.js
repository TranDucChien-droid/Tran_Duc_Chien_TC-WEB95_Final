import { Router } from "express";
import { body, param } from "express-validator";
import * as quizController from "../controllers/quiz.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";
import { handleValidation } from "../middlewares/validate.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", quizController.listQuizzes);
router.get("/:id", [param("id").isMongoId()], handleValidation, quizController.getQuizById);

router.post(
  "/",
  requireAdmin,
  [body("title").isString().trim().notEmpty(), body("description").optional().isString()],
  handleValidation,
  quizController.createQuiz
);

router.patch(
  "/:id",
  requireAdmin,
  [param("id").isMongoId(), body("title").optional().isString().trim().notEmpty(), body("description").optional().isString()],
  handleValidation,
  quizController.updateQuiz
);

router.delete("/:id", requireAdmin, [param("id").isMongoId()], handleValidation, quizController.deleteQuiz);

export default router;
