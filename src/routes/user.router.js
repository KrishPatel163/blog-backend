import { Router } from "express";
import { handleLogin, handleLogout, handleRegister } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(handleRegister);
router.route("/login").post(handleLogin);
router.route("/logout").post(verifyJWT, handleLogout)

export default router;
