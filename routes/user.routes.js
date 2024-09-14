import { Router } from "express";
import {
  login,
  register,
  logout,
  getProfile,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
const userRoutes = Router();
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/logout", logout);
userRoutes.get("/me",isLoggedIn, getProfile);

export default userRoutes;
