import express from "express";

import authenticateDoctor from "../middlewares/doctorAuth.js";

const doctorAuthRouter = express.Router();
import multer from "multer";

import {
  registerDoctor,
  loginDoctor,
  profile,
} from "../controllers/doctorAuthController.js";

const upload = multer();

doctorAuthRouter.post("/register", upload.none(), registerDoctor);
doctorAuthRouter.post("/login", loginDoctor);
doctorAuthRouter.get("/profile", authenticateDoctor, profile);

export default doctorAuthRouter;
