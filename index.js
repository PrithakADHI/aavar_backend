import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import db from "./models/index.js";

import authRouter from "./routes/authRoutes.js";
import doctorAuthRouter from "./routes/doctorAuthRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

const { sequelize } = db;

app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/doctor/auth", doctorAuthRouter);
app.use("/api", doctorRouter, userRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello" });
});

const runApp = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect: ", err);
  }
};

runApp();
