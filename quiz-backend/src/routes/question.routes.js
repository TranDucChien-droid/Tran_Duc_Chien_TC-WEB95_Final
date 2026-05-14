import { Router } from "express";
import * as questionController from "../controllers/question.controller.js";
import {
  questionAdminChain,
  questionCreateChain,
  questionDeleteChain,
  questionImportExcelChain,
  questionUpdateChain,
} from "../middlewares/question.routes.middleware.js";

const router = Router();

router.use(...questionAdminChain());

router.post("/quizzes/:quizId/questions", ...questionCreateChain(), questionController.createQuestion);
router.patch("/questions/:id", ...questionUpdateChain(), questionController.updateQuestion);
router.delete("/questions/:id", ...questionDeleteChain(), questionController.deleteQuestion);
router.post("/quizzes/:quizId/questions/import", ...questionImportExcelChain(), questionController.importQuestions);

export default router;
