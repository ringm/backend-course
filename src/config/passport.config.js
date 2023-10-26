import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { userService } from "../dao/index.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const GithubStrategy = GitHubStrategy.Strategy;

export const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await userService.findUser(profile._json.email);
          if (!user) {
            const newUser = {
              username: profile.username,
              email: profile._json.email,
              password: "",
              isAdmin: false,
            };
            const res = await userService.signUpUser(newUser);
            done(null, res);
          } else {
            done(null, user);
          }
        } catch (e) {
          return done(e);
        }
      },
    ),
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { username: user_name, email, isAdmin } = req.body;
        try {
          const user = await userService.findUser(username);
          if (user) {
            console.log("User already exists.");
            return done(null, false);
          }
          const newUser = {
            username: user_name,
            email,
            password: createHash(password),
            isAdmin,
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
    "login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        const user = await userService.findUser(username);
        if (!user) {
          console.log("User doesn't exist.");
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }),
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.findUserById(id);
    return done(null, user);
  });
};
