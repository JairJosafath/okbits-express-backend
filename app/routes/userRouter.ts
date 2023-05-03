import express from "express";
import { generatePasswordHash } from "../utils/password";
import {
  addUser,
  findUserByUsername,
  getUserByID,
  updateUserByID,
} from "../controllers/user";
import passport, { AuthenticateOptions } from "passport";
import { isAuthenticated, isAuthorized } from "../middleware/isAuth";
import { deleteSessionByID } from "../controllers/session";

export const userRouter = express.Router();

//this allows a user who is authenticated to have access without having to log in again
userRouter.get("/auto-signin", isAuthenticated, async (req, res) => {
  if (req.user?.id) {
    const user = await getUserByID(req.user?.id);
    if (req.user && user) {
      const { id, username, profile } = user;
      res.send({ msg: "Success", user: { id, username, profile } });
    } else {
      res.send({ msg: "Failed", user: {} });
    }
  }
});

userRouter.post(
  "/signin",
  passport.authenticate("local", {
    keepSessionInfo: false,
    failureRedirect: "/login-failure",
  }),
  async function (req, res) {
    const user = await findUserByUsername(req.body.username);
    if (req.user && user?.id) {
      const { id, username, profile, alias } = user;
      console.log("req.user", req.user);
      req.login(req.user, function (err) {
        if (err) {
          console.error(err);
          return res.send({ msg: "Failed", user: {} });
        }
        return res.send({
          msg: "Success",
          user: { id, username, profile, alias },
        });
      });
    } else {
      res.send({ msg: "Failed", user: {} });
    }
  }
);

userRouter.get("/login-failure", (req, res) => {
  res.send({ body: { msg: "Auth unsuccesful" } });
});

// user session renews when signing out, making the client persistent logged in still
userRouter.post("/signout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.send("succ");
  });
});

// user left hanging when trying to sign in with deleted user creds, because cookies stay, will handle on clientside
userRouter.post("/signup", async (req, res) => {
  const { password, username } = req.body;

  const { salt, hash } = generatePasswordHash(password);

  try {
    const result = addUser({
      username,
      alias: username,
      salt,
      hash,
    });
    res.send(result);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

userRouter.post("/reset-password", async (req, res) => {
  const { password, username } = req.body;

  const { salt, hash } = generatePasswordHash(password);

  try {
    const user = await findUserByUsername(username);
    if (user?.get("id")) {
      const result = updateUserByID(user.get("id") || 0, {
        salt,
        hash,
      });
      res.send(result);
    }
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
