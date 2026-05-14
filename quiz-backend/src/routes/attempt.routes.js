import { Router } from "express";
import * as attemptController from "../controllers/attempt.controller.js";
import { attemptAuthenticatedChain, attemptSubmitChain } from "../middlewares/attempt.middleware.js";

const router = Router();

router.use(...attemptAuthenticatedChain());

router.post("/", ...attemptSubmitChain(), attemptController.submitAttempt);
router.get("/me", attemptController.listMyAttempts);

export default router;
