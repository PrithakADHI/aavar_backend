import express from "express";
import {
  createVitalReport,
  readAllVitalReports,
  readAllAppointments,
  acceptPendingRequest,
  rejectPendingRequest,
  readAcceptedAppointments,
} from "../controllers/doctorController.js";

import { profile } from "../controllers/doctorAuthController.js";

import authenticateDoctor from "../middlewares/doctorAuth.js";

const doctorRouter = express.Router();

doctorRouter.post("/doctor/vitalreport", createVitalReport);
doctorRouter.get("/doctor/vitalreport", readAllVitalReports);

doctorRouter.get(
  "/doctor/appointments",
  authenticateDoctor,
  readAllAppointments
);
doctorRouter.get(
  "/doctor/accepted_appointments",
  authenticateDoctor,
  readAcceptedAppointments
);

doctorRouter.get("/doctor/profile", authenticateDoctor, profile);

doctorRouter.post(
  "/doctor/appointments/accept/:appointmentId",
  authenticateDoctor,
  acceptPendingRequest
);
doctorRouter.post(
  "/doctor/appointments/reject/:appointmentId",
  authenticateDoctor,
  rejectPendingRequest
);

export default doctorRouter;
