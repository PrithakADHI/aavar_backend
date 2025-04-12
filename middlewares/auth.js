import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import User from "../models/User.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

const strategy = new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await User.findByPk(jwt_payload.id, {
      attributes: { exclude: ["password"] },
    });
    if (user) {
      return done(null, user);
    } else {
      console.log("User not found");
      return done(null, false);
    }
  } catch (err) {
    console.error("Error in JWT strategy:", err);
    return done(err, false);
  }
});

passport.use("user-jwt", strategy);

const authenticateUser = async (req, res, next) => {
  passport.authenticate("user-jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res
        .status(500)
        .json({ error: "An error occurred during authentication." });
    }

    if (!user) {
      console.log("Authentication failed. Info:", info);
      return res
        .status(401)
        .json({ error: "Unauthorized. Token is missing or invalid." });
    }

    console.log("Authenticated User:", user.id);
    req.user = user;
    next();
  })(req, res, next);
};

export const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res
      .status(500)
      .json({ error: "Server error. Invalid order of middleware (?)" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "This path is only accessible by an admin." });
  }
  next();
};

export const allowSelfOnlyEdit = (req, res, next) => {
  const userIdToEdit = req.params.id || req.body.id;

  if (!userIdToEdit) {
    return res.status(400).json({ error: "Target user ID is missing." });
  }

  if (String(req.user.id) !== String(userIdToEdit)) {
    return res.status(403).json({
      error: "You are not authorized to modify another user's profile.",
    });
  }

  next();
};

export default authenticateUser;
