import VitalReport from "../models/VitalReport.js";
import Doctor from "../models/Doctor.js";
import Activities from "../models/Activities.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export const createAppointmentCheckoutSession = async (req, res) => {
  const user = req.user;
  const { doctorId, address, description, dateOfAppointment } = req.body;

  try {
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor || !doctor.perHourPrice) {
      return res.status(400).json({
        success: false,
        message:
          "This doctor doesn't currently have the ability to get appointments.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: doctor.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: `${process.env.CLIENT_URL}/appointment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/appointment-cancel`,

      // ✅ Here's the metadata block
      metadata: {
        doctorId: doctorId.toString(),
        address: address || "",
        description: description || "",
        dateOfAppointment: dateOfAppointment || "",
      },
    });

    return res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyPaymentAndCreateAppointment = async (req, res) => {
  const user = req.user;
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed" });
    }

    // You may also add additional checks here

    const metadata = session.metadata || {};
    const doctorId = metadata.doctorId || req.body.doctorId; // fallback if metadata not used
    const address = metadata.address || req.body.address;
    const dateOfAppointment =
      metadata.dateOfAppointment || req.body.dateOfAppointment;
    const description = metadata.description || req.body.description;

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const newAppointment = await Appointment.create({
      description,
      address,
      dateOfAppointment,
      doctorId,
      status: "pending",
      patientName: user.username,
      userId: user.id,
    });

    const newTransaction = await Transaction.create({
      patientName: user.username,
      description: description,
      address,
      amount: doctor.perHourPrice,
      status: "pending",
    });

    return res.status(201).json({ success: true, appointment: newAppointment });
  } catch (err) {
    console.error("Payment verification failed:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
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

export const deleteBooking = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    const activity = await Activities.findByPk(activityId);

    if (!user || !activity) {
      return res.status(404).json({ message: "User or Activity not found" });
    }

    const alreadyBooked = await user.hasBookedActivity(activity);
    if (!alreadyBooked) {
      return res.status(400).json({ message: "Activity not booked" });
    }

    await user.removeBookedActivity(activity);

    return res.status(200).json({ message: "Booking removed successfully" });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};
