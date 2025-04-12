import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

import LocalStrategy from "passport-local";
import Doctor from "../models/Doctor.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "7d" });
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const doctor = await Doctor.findOne({ where: { email } });
        if (!doctor) {
          return done(null, false, { message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect Password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const doctor = await Doctor.findByPk(id);
    done(null, doctor);
  } catch (err) {
    done(err, null);
  }
});

export const registerDoctor = async (req, res) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    profilePicture,
    role,
    contactNumber,
    verified,
    bio,
    perHourPrice,
    rating,
    specialization,
    certifications,
    citizenshipNumber,
    citizenshipPhotoFront,
    citizenshipPhotoBack,
  } = req.body;

  // let { certifications } = req.body;

  // if (!certifications) {
  //   certifications = [];
  // }

  // const verified = false;

  // //   const file = req.file;

  // //   const imageUrl = file ? `/uploads/${file.filename}` : null;

  // const parsedCertifications = Array.isArray(certifications)
  //   ? certifications
  //   : JSON.parse(certifications);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctorExists = await Doctor.findOne({ where: { email } });

    if (doctorExists) {
      return res
        .status(400)
        .json({ message: "Doctor has already been registered." });
    }

    const newDoctor = await Doctor.create({
      firstName,
      lastName,
      username,
      email,
      role,
      contactNumber,
      profilePicture,
      specialization,
      bio,
      certifications,
      perHourPrice,
      rating,
      citizenshipNumber,
      citizenshipPhotoFront,
      citizenshipPhotoBack,
      verified,
      certifications: parsedCertifications,
      password: hashedPassword,
      //   profilePicture: imageUrl,
    });

    res.status(201).json({
      message: `Doctor ${newDoctor.username} registered successfully.`,
    });
  } catch (err) {
    console.error(`${err.message}`);
    res.status(500).json({ error: "Error registering doctor: " + err.message });
  }
};

export const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ where: { email } });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor Not Found." });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const accessToken = generateAccessToken(doctor);
    // const refreshToken = generateRefreshToken(user);

    // Token.create({ refreshToken });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      //   refreshToken,
      doctor,
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in: " + err.message });
  }
};

export const profile = (req, res) => {
  const doctor = req.doctor;
  return res.json({ doctor });
};
