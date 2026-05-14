import { Router } from "express";
import * as quizController from "../controllers/quiz.controller.js";
import {
  quizAuthenticatedChain,
  quizCreateChain,
  quizDeleteChain,
  quizGetByIdChain,
  quizUpdateChain,
} from "../middlewares/quiz.routes.middleware.js";

const router = Router();

router.use(...quizAuthenticatedChain());

router.get("/", quizController.listQuizzes);
router.get("/:id", ...quizGetByIdChain(), quizController.getQuizById);

router.post("/", ...quizCreateChain(), quizController.createQuiz);
router.patch("/:id", ...quizUpdateChain(), quizController.updateQuiz);
router.delete("/:id", ...quizDeleteChain(), quizController.deleteQuiz);

export default router;
