import express from "express";

const authRouter = express.Router();
import {
  registerUser,
  loginUser,
  editUser,
} from "../controllers/authController.js";

import authenticateUser, { allowSelfOnlyEdit } from "../middlewares/auth.js";

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.patch("/edit", authenticateUser, allowSelfOnlyEdit, editUser);

export default authRouter;
