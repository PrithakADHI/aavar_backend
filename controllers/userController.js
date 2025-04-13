import VitalReport from "../models/VitalReport.js";
import Doctor from "../models/Doctor.js";
import Activities from "../models/Activities.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

// Everything at one place for Dashboard

export const readDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const vitalReports = await VitalReport.findAll({ where: { userId } });

    // Fetch top 3 doctors by rating (non-null), role = 'doctor'
    const topThreeDoctors = await Doctor.findAll({
      where: {
        role: "doctor",
      },
      order: [["id", "ASC"]],
      limit: 3,
      attributes: {
        exclude: [
          "password",
          "citizenshipNumber",
          "citizenshipPhotoFront",
          "citizenshipPhotoBack",
          "certifications",
        ],
      },
    });

    // Fetch top 3 nurses by rating (non-null), role = 'nurse'
    const topThreeNurses = await Doctor.findAll({
      where: {
        role: "nurse",
      },
      order: [["id", "ASC"]],
      limit: 3,
    });

    // Fetch top 3 caretakers by rating (non-null), role = 'caretaker'
    const topThreeCareTakers = await Doctor.findAll({
      where: {
        role: "caretaker",
      },
      order: [["id", "ASC"]],
      limit: 3,
    });

    const topFiveActivities = await Activities.findAll({
      order: [["id", "ASC"]],
      limit: 5,
    });

    return res.status(200).json({
      vitalReports,
      topThreeDoctors,
      topThreeNurses,
      topThreeCareTakers,
      topFiveActivities,
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const readVitalReports = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const vitalReports = await VitalReport.findAll({ where: { userId } });

    return res.status(200).json({ success: true, data: vitalReports });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: "Error occured." });
  }
};

export const readSingleVitalReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const vitalReport = await VitalReport.findOne({ where: { id: reportId } });

    if (!vitalReport) {
      return res
        .status(404)
        .json({ success: false, message: "Can't find the Report." });
    }

    return res.status(200).json({ success: true, data: vitalReport });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: "Error occured: " });
  }
};

// View all Doctors
export const readAllDoctors = async (req, res) => {
  try {
    const allDoctors = await Doctor.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "username",
        "email",
        "role",
        "rating",
        "experience",
        "bio",
        "perHourPrice",
        "profilePicture",
      ],
    });

    return res.status(200).json({
      success: true,
      data: allDoctors,
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: "Error occured: " });
  }
};

export const readOneDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await Doctor.findOne({
      where: { id: doctorId },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "username",
        "email",
        "role",
        "rating",
        "experience",
        "bio",
        "perHourPrice",
        "profilePicture",
      ],
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    return res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: "Error occured: " });
  }
};

export const readAllActivities = async (req, res) => {
  try {
    const allActivities = await Activities.findAll();

    return res.status(200).json({ success: true, data: allActivities });
  } catch (err) {
    console.error(`Error ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const readOneActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;

    const activity = await Activities.findOne({ where: { id: activityId } });

    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity Not Found." });
    }

    return res.status(200).json({ success: true, data: activity });
  } catch (err) {
    console.error(`Error ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

// Appointment Parts

export const readAllAppointments = async (req, res) => {
  const userId = req.user.id;

  try {
    const appointments = await Appointment.findAll({ where: { userId } });

    if (!appointments) {
      return res
        .status(404)
        .json({ success: false, message: "Appointments not found." });
    }

    return res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const createAppointment = async (req, res) => {
  const user = req.user;

  const { description, address, dateOfAppointment, doctorId } = req.body;
  const status = "pending";

  try {
    const newAppointment = await Appointment.create({
      description,
      address,
      dateOfAppointment,
      doctorId,
      status,
      patientName: user.username,
      userId: user.id,
    });

    return res.status(201).json({ success: true, appointment: newAppointment });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const bookActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    const activity = await Activities.findByPk(activityId);

    if (!user || !activity) {
      return res.status(404).json({ message: "User or Activity not found" });
    }

    // Check if already booked (optional)
    const alreadyBooked = await user.hasBookedActivity(activity);
    if (alreadyBooked) {
      return res.status(400).json({ message: "Activity already booked" });
    }

    await user.addBookedActivity(activity);

    return res.status(200).json({ message: "Activity booked successfully" });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};
