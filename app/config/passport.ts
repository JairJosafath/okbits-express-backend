declare global {
  namespace Express {
    interface User {
      username: string;
      id?: number | undefined;
    }
  }
}
import passport from "passport";
import localStrategy from "passport-local";
import { sequelize } from "./db";
import UserModel from "../models/user";
import { isPasswordValid } from "../utils/password";
import { findUserByUsername, getUserByID } from "../controllers/user";

const params = {
  usernameField: "username",
  passwordField: "password",
};

async function verifyCallback(
  username: string,
  password: string,
  done: CallableFunction
) {
  try {
    // Find user by username
    const user = await findUserByUsername(username);
    if (!user) {
      // user does not exist
      return done(null, false);
    }

    const isValid = isPasswordValid(password, user.hash || "", user.salt || "");

    if (isValid) {
      // auth was succesful
      return done(null, user);
    } else {
      // not succesful
      return done(null, false);
    }
  } catch (e) {
    // an err occurred
    console.log(e);
    done(e);
  }
}

const strategy = new localStrategy.Strategy(params, verifyCallback);

passport.use(strategy);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser<number>(async function (id, done) {
  try {
    const user = await getUserByID(id);

    if (user) {
      done(null, user);
    }
  } catch (err) {
    // an error occurred
    console.log(err);
    done(err);
  }
});
