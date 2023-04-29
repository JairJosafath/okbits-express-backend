import express, { json } from "express";
import { fileRouter } from "./routes/fileRouter";
import { userRouter } from "./routes/userRouter";
import { isAuthenticated } from "./middleware/isAuth";
import passport from "passport";
import session from "express-session";

const app = express();
const port = 3001;

app.use(json());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/files", isAuthenticated, fileRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log("listening on port: " + port);
});
