import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

import LocalStrategy from "passport-local";
import User from "../models/User.js";
import VitalReport from "../models/VitalReport.js";
import Activities from "../models/Activities.js";
import Bookings from "../models/Bookings.js";
import Appointment from "../models/Appointment.js";

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
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
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
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export const registerUser = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  //   const file = req.file;

  //   const imageUrl = file ? `/uploads/${file.filename}` : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User has already been registered." });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      //   profilePicture: imageUrl,
    });

    res
      .status(201)
      .json({ message: `User ${newUser.username} registered successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Error registering user: " + err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const accessToken = generateAccessToken(user);
    // const refreshToken = generateRefreshToken(user);

    // Token.create({ refreshToken });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      //   refreshToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in: " + err.message });
  }
};

export const editUser = async (req, res) => {
  const userId = req.user?.id; // assumes user is authenticated and req.user is populated
  const { username, email, password, firstName, lastName } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return res.json({ message: "User updated successfully", user });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error updating user: " + err.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // Get full user info with booked activities
    const fullUser = await User.findByPk(user.id, {
      attributes: { exclude: ["password"] }, // optional: hide password
      include: [
        {
          model: Activities,
          as: "bookedActivities",
          through: { attributes: [] }, // exclude Bookings table fields
        },
        {
          model: Appointment,
        },
      ],
    });

    // Get latest vital report
    const latestReport = await VitalReport.findOne({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      user: fullUser,
      latestReport,
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};
