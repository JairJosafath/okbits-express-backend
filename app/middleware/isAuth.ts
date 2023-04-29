import { Request, Response } from "express";

export const isAuthenticated = function (
  req: Request,
  res: Response,
  next: CallableFunction
) {
  try {
    if (req.isAuthenticated()) next();
    else res.status(401).json({ msg: "unauthorized" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "error" });
  }
};
