import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import Caretaker from "../models/Caretaker.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

const strategy = new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const caretaker = await Caretaker.findByPk(jwt_payload.id);
    if (caretaker) {
      return done(null, caretaker);
    } else {
      console.log("Caretaker not found");
      return done(null, false);
    }
  } catch (err) {
    console.error("Error in JWT strategy:", err);
    return done(err, false);
  }
});

passport.use("caretaker-jwt", strategy);

const authenticateCaretaker = async (req, res, next) => {
  passport.authenticate(
    "caretaker-jwt",
    { session: false },
    (err, caretaker, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return res
          .status(500)
          .json({ error: "An error occurred during authentication." });
      }

      if (!caretaker) {
        console.log("Authentication failed. Info:", info);
        return res
          .status(401)
          .json({ error: "Unauthorized. Token is missing or invalid." });
      }

      console.log("Authenticated Caretaker:", caretaker.id);
      req.caretaker = caretaker;
      next();
    }
  )(req, res, next);
};

export default authenticateCaretaker;
