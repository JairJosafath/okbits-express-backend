import { NextFunction, Request, Response } from "express";
import { getUserByID } from "../controllers/user";

export const isAuthenticated = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // is user already authenticated?
  try {
    if (req.isAuthenticated()) next();
    else res.status(401).json({ msg: "unauthorized" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "error" });
  }
};

//resources only exposed to owners and admin
export const isAuthorized = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // is user authorized? owners can crud files, and admin can crud all
  try {
    if (req.user?.id) {
      const user = await getUserByID(req.user?.id);
      if (user?.role === "admin") next(); //if its an admin, let em truu!
      else if (user?.id === req.user.id) next(); // its the owner its ok
      else res.status(401).json({ msg: "unauthorized" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "error" });
  }
};
//for admin only routes and resources
export const isAdmin = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // is user authorized? owners can crud files, and admin can crud all
  try {
    if (req.user?.id) {
      const user = await getUserByID(req.user?.id);
      if (user?.role === "admin") next();
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "error" });
  }
};
