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
  readAllDoctors,
  readAllRejectedDoctors,
} from "../controllers/adminController.js";

import {
  loginAdmin,
  registerAdmin,
} from "../controllers/adminAuthController.js";

const upload = multer();

adminRouter.post("/activity", authenticateAdmin, upload.none(), createActivity);
adminRouter.get("/activity", authenticateAdmin, readAllActivities);
adminRouter.get("/activity/:activityId", authenticateAdmin, readOneActivity);

adminRouter.post("/auth/login", authenticateAdmin, loginAdmin);
adminRouter.post("/auth/register", authenticateAdmin, registerAdmin);

adminRouter.post("/doctor/accept/:doctorId", authenticateAdmin, acceptDoctor);
adminRouter.post("/doctor/reject/:doctorId", authenticateAdmin, rejectDoctor);

// adminRouter.get("/doctor/accepted", readAllAcceptedDoctors);
// adminRouter.get("/doctor/rejected", readAllRejectedDoctors);
// adminRouter.get("/doctor/pending", readAllPendingDoctors);

adminRouter.get("/doctors", authenticateAdmin, readAllDoctors);

export default adminRouter;
