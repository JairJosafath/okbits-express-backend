import express from "express";
import { getUserByID, updateUserByID } from "../controllers/user";
import passport from "passport";
import { isAuthenticated } from "../middleware/isAuth";

export const profileRouter = express.Router();

//this allows a user who is authenticated to have access without having to log in again
profileRouter.get("/", isAuthenticated, async (req, res) => {
  if (req.user?.id) {
    const user = await getUserByID(req.user?.id);
    if (req.user && user) {
      const { id, username, profile, role } = user;
      res.send({ msg: "Success", user: { id, username, profile, role } });
    } else {
      res.send({ msg: "Failed", user: {} });
    }
  }
});

profileRouter.post("/update", isAuthenticated, async (req, res) => {
  const { id, username, alias, profile, role } = req.body;
  console.log(req.body);
  if (req.user?.id) {
    const user = await getUserByID(req.user?.id);
    if (req.user && user) {
      updateUserByID(req.user?.id, { profile, alias });
      res.send({
        msg: "Success",
        user: { id, username, alias, profile, role: role },
      });
    } else {
      res.send({ msg: "Failed", user: {} });
    }
  }
});

profileRouter.delete("/", isAuthenticated, async (req, res) => {
  if (req.user?.id) {
    const user = await getUserByID(req.user?.id);
    if (req.user && user) {
      user.destroy();
      res.send({ msg: "Success", user: {} });
    } else {
      res.send({ msg: "Failed", user: {} });
    }
  }
});