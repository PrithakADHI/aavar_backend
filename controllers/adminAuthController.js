import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

import LocalStrategy from "passport-local";
import Admin from "../models/Admin.js";

const generateAccessToken = (admin) => {
  return jwt.sign({ id: admin.id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
          return done(null, false, { message: "Admin not found." });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect Password." });
        }

        return done(null, admin);
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
    const user = await Admin.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ error: "Admin Not Found." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const accessToken = generateAccessToken(admin);
    // const refreshToken = generateRefreshToken(user);

    // Token.create({ refreshToken });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      //   refreshToken,
      admin,
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in: " + err.message });
  }
};

export const registerAdmin = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  //   const file = req.file;

  //   const imageUrl = file ? `/uploads/${file.filename}` : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminExists = await Admin.findOne({ where: { email } });

    if (adminExists) {
      return res
        .status(400)
        .json({ message: "User has already been registered." });
    }

    const newAdmin = await Admin.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      //   profilePicture: imageUrl,
    });

    res
      .status(201)
      .json({ message: `Admin ${newAdmin.username} registered successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Error registering admin: " + err.message });
  }
};

export const profile = (req, res) => {
  const admin = req.admin;
  return res.json({ admin });
};
