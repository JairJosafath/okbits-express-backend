import express from "express";
import { generatePasswordHash } from "../utils/password";
import { addUser, findUserByUsername } from "../controllers/user";
import passport from "passport";

export const userRouter = express.Router();

userRouter.post(
  "/signin",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async function (req, res) {
    const user = await findUserByUsername(req.body.username);
    if (user) {
      const { id, username, profile } = user;
      res.send({ msg: "Success", user: { id, username, profile } });
    } else {
      res.send({ msg: "Failed", user: {} });
    }
  }
);

userRouter.get("/login-failure", (req, res) => {
  res.send({ body: { msg: "Auth unsuccesful" } });
});

userRouter.get("/signout", (req, res, next) => {
  req.logOut(next);
  res.send("signout");
});

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
