import Activities from "../models/Activities.js";
import Doctor from "../models/Doctor.js";
import Transaction from "../models/Transaction.js";

export const createActivity = async (req, res) => {
  const {
    title,
    description,
    numberOfPeople,
    price,
    tentativeDate,
    time,
    category,
    booked,
    numberOfDays,
  } = req.body;

  let { images } = req.body;

  if (!images) {
    images = [];
  }

  const parsedImages = Array.isArray(images) ? images : JSON.parse(images);

  const newActivity = await Activities.create({
    title,
    description,
    numberOfPeople,
    price,
    tentativeDate,
    time,
    booked,
    category,
    numberOfDays,
    images: parsedImages,
  });

  return res
    .status(201)
    .json({ message: `Activity ${title} created.`, activity: newActivity });
};

export const readAllActivities = async (req, res) => {
  try {
    const allActivities = await Activities.findAll();

    return res.status(200).json({ success: true, data: allActivities });
  } catch (err) {
    console.error(`Error: ${err.message}`);
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
        .json({ success: false, message: "Activity can't be found." });
    }

    return res.status(200).json({ success: true, data: activity });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const readAllDoctors = async (req, res) => {
  try {
    const allDoctors = await Doctor.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    return res.status(200).json({ success: true, data: allDoctors });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const readAllAcceptedDoctors = async (req, res) => {
  try {
    const allAcceptedDoctors = await Doctor.findAll({
      where: { verification: "verified" },
    });

    return res.status(200).json({ success: true, data: allAcceptedDoctors });
  } catch (err) {
    console.error(`Error ${err.message}`);
  }
};

export const readAllPendingDoctors = async (req, res) => {
  try {
    const allPendingDoctors = await Doctor.findAll({
      where: { verification: "pending" },
    });

    return res.status(200).json({ success: true, data: allPendingDoctors });
  } catch (err) {
    console.error(`Error ${err.message}`);
  }
};

export const readAllRejectedDoctors = async (req, res) => {
  try {
    const allRejectedDoctors = await Doctor.findAll({
      where: { verification: "verified" },
    });

    return res.status(200).json({ success: true, data: allRejectedDoctors });
  } catch (err) {
    console.error(`Error ${err.message}`);
  }
};

export const acceptDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const doctor = await Doctor.findOne({ where: { id: doctorId } });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    doctor.verification = "verified";
    await doctor.save();

    return res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const rejectDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const doctor = await Doctor.findOne({ where: { id: doctorId } });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    doctor.verification = "unverified";
    await doctor.save();

    return res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const readAllTransactions = async (req, res) => {
  try {
    const allTransactions = await Transaction.findAll();

    return res.status(200).json({ success: true, data: allTransactions });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const acceptTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;

    const transaction = await Transaction.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    transaction.verification = "accepted";
    await transaction.save();

    return res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const rejectTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;

    const transaction = await Transaction.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    transaction.verification = "accepted";
    await transaction.save();

    return res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};
