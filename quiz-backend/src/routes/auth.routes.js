import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authLoginChain, authMeChain, authRegisterChain } from "../middlewares/auth.routes.middleware.js";

const router = Router();

router.post("/register", ...authRegisterChain(), authController.register);
router.post("/login", ...authLoginChain(), authController.login);
router.get("/me", ...authMeChain(), authController.me);

export default router;
