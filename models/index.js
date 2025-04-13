import sequelize from "../database.js";

// Import models
import User from "./User.js";
import Doctor from "./Doctor.js";
import Appointment from "./Appointment.js";
import VitalReport from "./VitalReport.js";
import Admin from "./Admin.js";
import Activities from "./Activities.js";
import Bookings from "./Bookings.js";
import Transaction from "./Transaction.js";

// Set up associations here only (AFTER models are defined)

// User → VitalReport
User.hasMany(VitalReport, {
  foreignKey: "userId",
  as: "vitalReports",
  onDelete: "CASCADE",
});
VitalReport.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

// User → Appointment
User.hasMany(Appointment, { foreignKey: "userId" });
Appointment.belongsTo(User, { foreignKey: "userId" });

// Doctor → Appointment
Doctor.hasMany(Appointment, { foreignKey: "doctorId" });
Appointment.belongsTo(Doctor, { foreignKey: "doctorId" });

User.belongsToMany(Activities, { through: Bookings, as: "bookedActivities" });
Activities.belongsToMany(User, { through: Bookings, as: "bookedUsers" });

const db = {
  sequelize,
  User,
  Doctor,
  Appointment,
  VitalReport,
  Admin,
  Activities,
  Transaction,
  Bookings,
};

export default db;
