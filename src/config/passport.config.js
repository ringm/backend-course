import passport from "passport";
import JwtStrategy from "passport-jwt";
import { userService } from "../services/index.js";

const JWTStrategy = JwtStrategy.Strategy;
const ExtractJWT = JwtStrategy.ExtractJwt;

export const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (e) {
          return done(e);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.findById(id);
    return done(null, user);
  });
};

function cookieExtractor(req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies[process.env.TOKEN_COOKIE_NAME];
  }
  return token;
}
