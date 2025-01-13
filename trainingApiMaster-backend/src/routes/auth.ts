import express from "express";
import { register, login, getMe, forgotPassword, resetPassword } from "../controllers/auth";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/me", protect, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:resetToken", resetPassword);

export default router;
