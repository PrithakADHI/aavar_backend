import express from "express";

import { loginAdmin } from "../controllers/adminAuthController.js";

const adminAuthRouter = express.Router();

adminAuthRouter.post("/login", loginAdmin);

export default adminAuthRouter;
