import Activities from "../models/Activities.js";
import Doctor from "../models/Doctor.js";

export const createActivity = async (req, res) => {
  const {
    title,
    description,
    numberOfPeople,
    price,
    tentativeDate,
    time,
    category,
    numberOfDays,
    booked,
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
    category,
    numberOfDays,
    images: parsedImages,
    booked,
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

export const readAllAcceptedDoctors = async (req, res) => {
  try {
    const allAcceptedDoctors = await Doctor.findAll({
      where: { verified: true },
    });
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

    doctor.verified = true;
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

    doctor.verified = false;
    await doctor.save();

    return res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};
