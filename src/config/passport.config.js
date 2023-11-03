import passport from "passport";
import local from "passport-local";
//import GitHubStrategy from "passport-github2";
import JwtStrategy from "passport-jwt";
import { userService } from "../dao/index.js";
import { cartService } from "../dao/index.js";
import { createHash } from "../utils.js";

const LocalStrategy = local.Strategy;
//const GitStrategy = GitHubStrategy.Strategy;
const JWTStrategy = JwtStrategy.Strategy;
const ExtractJWT = JwtStrategy.ExtractJwt;

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { email, first_name, last_name, age, role } = req.body;
        try {
          const user = await userService.findUser(email);
          if (user) {
            console.log("User already exists.");
            return done(null, false);
          }
          const cart = await cartService.createCart({});
          const newUser = {
            first_name,
            last_name,
            age,
            email,
            cart: cart._id,
            password: createHash(password),
            role,
          };
          const res = await userService.signUpUser(newUser);
          return done(null, res);
        } catch (e) {
          return done("Error signing up user: " + error);
        }
      },
    ),
  );

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

  // passport.use(
  //   "github",
  //   new GitStrategy(
  //     {
  //       clientID: process.env.GITHUB_CLIENT_ID,
  //       clientSecret: process.env.GITHUB_CLIENT_SECRET,
  //       callbackURL: "https://coderhouse-ecommerce-backend.ringm.com.ar/api/sessions/github-callback",
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       try {
  //         console.log(profile);
  //         const user = await userService.findUser(profile._json.email);
  //         if (!user) {
  //           const newUser = {
  //             username: profile.username,
  //             email: profile._json.email,
  //             password: "",
  //             isAdmin: false,
  //           };
  //           const res = await userService.signUpUser(newUser);
  //           done(null, res);
  //         } else {
  //           done(null, user);
  //         }
  //       } catch (e) {
  //         return done(e);
  //       }
  //     },
  //   ),
  // );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.findUserById(id);
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
