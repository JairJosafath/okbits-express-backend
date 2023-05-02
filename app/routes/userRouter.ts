import express from "express";
import { generatePasswordHash } from "../utils/password";
import { addUser, findUserByUsername, getUserByID } from "../controllers/user";
import passport from "passport";
import { isAuthenticated } from "../middleware/isAuth";

export const userRouter = express.Router();

// userRouter.post(
//   "/signin",
//   passport.authenticate("local", { failureRedirect: "/login-failure" }),
//   async function (req, res) {
//     const user = await findUserByUsername(req.body.username);
//     if (user) {
//       const { id, username, profile } = user;
//       console.log("req.user", req.user);
//       res.send({ msg: "Success", user: { id, username, profile } });
//     } else {
//       res.send({ msg: "Failed", user: {} });
//     }
//   }
// );
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
  passport.authenticate("local", { failureRedirect: "/login-failure" }),
  async function (req, res) {
    const user = await findUserByUsername(req.body.username);
    if (req.user && user) {
      const { id, username, profile } = user;
      console.log("req.user", req.user);
      req.login(req.user, function (err) {
        if (err) {
          console.error(err);
          return res.send({ msg: "Failed", user: {} });
        }
        return res.send({ msg: "Success", user: { id, username, profile } });
      });
    } else {
      res.send({ msg: "Failed", user: {} });
    }
  }
);

userRouter.get("/login-failure", (req, res) => {
  res.send({ body: { msg: "Auth unsuccesful" } });
});
userRouter.get("/login-success", async (req, res) => {
  // const username = req.body.username.json;
  console.log("body", req.body);
  // const user = await findUserByUsername(username);
  // if (user) {
  //   const { id, username, profile } = user;
  //   res.send({ body: { msg: "Success", user: { id, username, profile } } });
  // }
  res.send({ body: { msg: "Failed", user: {} } });
});

userRouter.post("/signout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
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
