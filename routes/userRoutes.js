import express from "express";

import authenticateUser from "../middlewares/auth.js";
import {
  readVitalReports,
  readSingleVitalReport,
  readAllDoctors,
  readOneDoctor,
  readAllActivities,
  readOneActivity,
  readAllAppointments,
  createAppointment,
  deleteBooking,
  readDashboard,
  createAppointmentCheckoutSession,
  verifyPaymentAndCreateAppointment,
  bookActivity,
} from "../controllers/userController.js";

import { profile } from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.get("/user/dashboard", authenticateUser, readDashboard);

userRouter.get("/user/report", authenticateUser, readVitalReports);
userRouter.get("/user/report/:reportId", readSingleVitalReport);

userRouter.get("/user/doctors", readAllDoctors);
userRouter.get("/user/doctors/:doctorId", readOneDoctor);

userRouter.get("/user/activities", readAllActivities);
userRouter.get("/user/activities/:activityId", readOneActivity);

userRouter.get("/user/appointments", authenticateUser, readAllAppointments);
userRouter.post("/user/appointments", authenticateUser, createAppointment);

userRouter.get("/user/profile", authenticateUser, profile);

userRouter.post(
  "/user/book_activity/:activityId",
  authenticateUser,
  bookActivity
);

userRouter.delete(
  "/user/book_activity/:activityId",
  authenticateUser,
  deleteBooking
);

userRouter.post(
  "/user/appointment/checkout-session",
  authenticateUser,
  createAppointmentCheckoutSession
);

userRouter.post(
  "/user/appointment/verify-and-create",
  authenticateUser,
  verifyPaymentAndCreateAppointment
);

export default userRouter;
