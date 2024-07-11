import express from "express";
import {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	registerAdmin,
} from "../controllers/userControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);

router
	.route("/profile")
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);

// Route to register admin
router.post("/admin", protect, admin, registerAdmin);

export default router;
