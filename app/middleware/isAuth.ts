import { NextFunction, Request, Response } from "express";
import { getUserByID } from "../controllers/user";
import { getFileByID } from "../controllers/file";

// is user already authenticated?
export const isAuthenticated = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.isAuthenticated()) next();
    else res.status(401).json({ msg: "unauthorized" });
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
  try {
    if (req.user?.id) {
      const user = await getUserByID(req.user?.id);
      if (user?.get("role") === "admin") next();
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "error" });
  }
};

export const isAuthorized = {
  //resources only exposed to owners and admin
  multi: async function (req: Request, res: Response, next: NextFunction) {
    // is user authorized? owners can crud files, and admin can crud all
    try {
      if (req.user?.id && req.params.id) {
        const user = await getUserByID(req.user?.id);
        const file = await getFileByID(parseInt(req.params.id), req.user.id);
        if (user?.get("role") === "admin")
          next(); //if its an admin, let em truu!
        else if (user?.id === file?.get("user_id"))
          next(); // its the owner its ok
        else res.status(401).json({ msg: "unauthorized" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ msg: "error" });
    }
  },

  single: async function (req: Request, res: Response, next: NextFunction) {
    // is user authorized? owners can crud files, and admin can crud all
    try {
      if (req.user?.id && req.params.id) {
        const user = await getUserByID(req.user?.id);
        const file = await getFileByID(parseInt(req.params.id), req.user.id);
        if (user?.get("role") === "admin")
          next(); //if its an admin, let em truu!
        else if (user?.id === file?.get("user_id"))
          next(); // its the owner its ok
        else res.status(401).json({ msg: "unauthorized" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ msg: "error" });
    }
  },
  storage: async function (req: Request, res: Response, next: NextFunction) {
    // is user authorized? owners can crud files, and admin can crud all
    try {
      if (req.user?.id && req.params.filename) {
        const user = await getUserByID(req.user?.id);
        const resourceId = parseInt(req.params.filename.split("/")[0]);
        if (user?.get("role") === "admin" || user?.id === resourceId) {
          if (user?.id)
            req.params.filename = req.params.filename.replace(
              user?.id.toString() + "/files/",
              ""
            );
          next();
        } // its the owner its ok
        else res.status(401).json({ msg: "unauthorized" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ msg: "error" });
    }
  },
};
