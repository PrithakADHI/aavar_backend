import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import Admin from "../models/Admin.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

const strategy = new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const admin = await Admin.findByPk(jwt_payload.id);
    if (admin) {
      return done(null, admin);
    } else {
      console.log("User not found");
      return done(null, false);
    }
  } catch (err) {
    console.error("Error in JWT strategy:", err);
    return done(err, false);
  }
});

passport.use("admin-jwt", strategy);

const authenticateAdmin = async (req, res, next) => {
  passport.authenticate("admin-jwt", { session: false }, (err, admin, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res
        .status(500)
        .json({ error: "An error occurred during authentication." });
    }

    if (!admin) {
      console.log("Authentication failed. Info:", info);
      return res
        .status(401)
        .json({ error: "Unauthorized. Token is missing or invalid." });
    }

    console.log("Authenticated Admin:", admin.id);
    req.admin = admin;
    next();
  })(req, res, next);
};

export const adminAuth = (req, res, next) => {
  if (!req.admin) {
    return res
      .status(500)
      .json({ error: "Server error. Invalid order of middleware (?)" });
  }

  if (req.admin.role !== "admin") {
    return res
      .status(403)
      .json({ error: "This path is only accessible by an admin." });
  }
  next();
};

export default authenticateAdmin;
