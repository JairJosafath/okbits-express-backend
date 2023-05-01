import { NextFunction, Request, Response } from "express";

export const isAuthenticated = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.log({ session: req.session, user: req.user, auth: req.authInfo });
  try {
    if (req.isAuthenticated()) next();
    else res.status(401).json({ msg: "unauthorized" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "error" });
  }
};
