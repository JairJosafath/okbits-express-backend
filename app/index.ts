import express, { json } from "express";
import { fileRouter } from "./routes/fileRouter";
import { userRouter } from "./routes/userRouter";
import { isAuthenticated } from "./middleware/isAuth";
import passport from "passport";
import session from "express-session";
import "./config/passport";
import pgsession from "connect-pg-simple";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3001;

const psqlStore = new (pgsession(session))({
  conString: process.env.DATABASE_URL,
  tableName: "sessions",
});
app.use(json());

app.use(
  session({
    secret: process.env.SECRET || "",
    resave: false,
    saveUninitialized: true,
    store: psqlStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/files", isAuthenticated, fileRouter);
app.use(userRouter);

app.get("/test", (req, res) => {
  res.send(JSON.stringify("<p>hey!<p>"));
});

app.listen(port, () => {
  console.log("listening on port: " + port);
});
