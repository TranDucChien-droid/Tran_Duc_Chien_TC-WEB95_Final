import { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { handleValidation } from "../middlewares/validate.middleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 6 }),
  ],
  handleValidation,
  authController.register
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isString().notEmpty()],
  handleValidation,
  authController.login
);

router.get("/me", requireAuth, authController.me);

export default router;
