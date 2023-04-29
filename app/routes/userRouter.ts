import express from "express";
import { generatePasswordHash } from "../utils/password";
import UserModel from "../models/user";
import { addUser } from "../controllers/user";

export const userRouter = express.Router();

userRouter.post("/signin", (req, res) => {
  res.send("signin");
});

userRouter.post("/signout", (req, res) => {
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
