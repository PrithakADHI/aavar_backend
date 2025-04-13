import Appointment from "../models/Appointment.js";
import VitalReport from "../models/VitalReport.js";
import User from "../models/User.js";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createVitalReport = async (req, res) => {
  const {
    userId,
    bodyTemperatureCelsius,
    bloodPressureSystolic,
    bloodPressureDiastolic,
    heartRate,
    respiratoryRate,
    oxygenSaturationPercent,
    bloodGlucoseMgDl,
  } = req.body;

  try {
    const newVitalReport = await VitalReport.create({
      userId,
      bodyTemperatureCelsius,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      respiratoryRate,
      oxygenSaturationPercent,
      bloodGlucoseMgDl,
    });

    return res
      .status(201)
      .json({ message: `Report made successfully.`, report: newVitalReport });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: "Error occured." });
  }
};

export const readAllVitalReports = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const vitalReports = await VitalReport.findAll({ where: { userId } });

    return res.status(200).json({ success: true, data: vitalReports });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: "Error occured." });
  }
};

export const readAllAppointments = async (req, res) => {
  try {
    const doctorId = req.doctor.id;

    const allAppointments = await Appointment.findAll({ where: { doctorId } });

    return res.status(200).json({ success: true, data: allAppointments });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: "Error occured. " });
  }
};

export const readAcceptedAppointments = async (req, res) => {
  try {
    const doctorId = req.doctor.id;

    const allAcceptedAppointments = await Appointment.findAll({
      where: { doctorId, status: "accepted" },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "username",
            "firstName",
            "lastName",
            "profilePicture",
          ],
          include: [
            {
              model: VitalReport,
              attributes: [
                "id",
                "bodyTemperatureCelsius",
                "bloodPressureSystolic",
                "bloodPressureDiastolic",
                "heartRate",
                "respiratoryRate",
                "oxygenSaturationPercent",
                "bloodGlucoseMgDl",
                "createdAt",
              ],
              as: "vitalReports",
            },
          ],
        },
      ],
    });

    return res
      .status(200)
      .json({ success: true, data: allAcceptedAppointments });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const acceptPendingRequest = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required." });
    }

    const appointment = await Appointment.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    appointment.status = "accepted";
    await appointment.save();

    return res
      .status(200)
      .json({ success: true, message: "Appointment accepted successfully." });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred." });
  }
};

export const rejectPendingRequest = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required." });
    }

    const appointment = await Appointment.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    appointment.status = "rejected";
    await appointment.save();

    return res
      .status(200)
      .json({ success: true, message: "Appointment rejected successfully." });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred." });
  }
};

export const editDoctorPrice = async (req, res) => {
  try {
    const doctor = req.doctor;
    const { newPrice } = req.body;

    const amountInCents = Math.round(newPrice * 100);

    // Step 1: Check if doctor has Stripe product
    if (!doctor.stripeProductId) {
      const product = await stripe.products.create({
        name: `Consultation with Dr. ${doctor.username}`,
        metadata: { doctorId: doctor.id.toString() },
      });

      doctor.stripeProductId = product.id;
    }

    // Step 2: Create a new price
    const price = await stripe.prices.create({
      unit_amount: amountInCents,
      currency: "usd",
      product: doctor.stripeProductId,
    });

    doctor.perHourPrice = newPrice;
    doctor.stripePriceId = price.id;

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: `Price updated successfully to $${newPrice}`,
      stripeProductId: doctor.stripeProductId,
      stripePriceId: doctor.stripePriceId,
    });
  } catch (err) {
    console.error(`Error updating price: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the price.",
    });
  }
};
