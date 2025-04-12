import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import Doctor from "../models/Doctor.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

const strategy = new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const doctor = await Doctor.findByPk(jwt_payload.id, {
      attributes: { exclude: ["password"] },
    });
    if (doctor) {
      return done(null, doctor);
    } else {
      console.log("Doctor not found");
      return done(null, false);
    }
  } catch (err) {
    console.error("Error in JWT strategy:", err);
    return done(err, false);
  }
});

passport.use("doctor-jwt", strategy);

const authenticateDoctor = async (req, res, next) => {
  passport.authenticate(
    "doctor-jwt",
    { session: false },
    (err, doctor, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return res
          .status(500)
          .json({ error: "An error occurred during authentication." });
      }

      if (!doctor) {
        console.log("Authentication failed. Info:", info);
        return res
          .status(401)
          .json({ error: "Unauthorized. Token is missing or invalid." });
      }

      console.log("Authenticated Doctor:", doctor.id);
      req.doctor = doctor;
      next();
    }
  )(req, res, next);
};

export default authenticateDoctor;
