import express from "express";

import authenticateAdmin from "../middlewares/adminAuth.js";

const adminRouter = express.Router();
import multer from "multer";

import {
  createActivity,
  readAllActivities,
  readOneActivity,
  acceptDoctor,
  rejectDoctor,
  readAllAcceptedDoctors,
  readAllPendingDoctors,
  readAllRejectedDoctors,
} from "../controllers/adminController.js";

import {
  loginAdmin,
  registerAdmin,
} from "../controllers/adminAuthController.js";

const upload = multer();

adminRouter.post("/activity", upload.none(), createActivity);
adminRouter.get("/activity", readAllActivities);
adminRouter.get("/activity/:activityId", readOneActivity);

adminRouter.post("/auth/login", loginAdmin);
adminRouter.post("/auth/register", registerAdmin);

adminRouter.post("/doctor/accept/:doctorId", acceptDoctor);
adminRouter.post("/doctor/reject/:doctorId", rejectDoctor);

adminRouter.get("/doctor/accepted", readAllAcceptedDoctors);
adminRouter.get("/doctor/rejected", readAllRejectedDoctors);
adminRouter.get("/doctor/pending", readAllPendingDoctors);

export default adminRouter;
