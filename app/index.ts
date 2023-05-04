import express, { json } from "express";
import { fileRouter } from "./routes/fileRouter";
import { userRouter } from "./routes/userRouter";
import { isAuthenticated, isAuthorized } from "./middleware/isAuth";
import passport from "passport";
import session from "express-session";
import "./config/passport";
import pgsession from "connect-pg-simple";
import dotenv from "dotenv";
import cors from "cors";
import { profileRouter } from "./routes/profile.router";
dotenv.config();
const app = express();
const corsOptions: cors.CorsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
const port = 3001;

const psqlStore = new (pgsession(session))({
  conString: process.env.DATABASE_URL,
  tableName: "sessions",
});
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super secret",
    resave: false,
    saveUninitialized: true,
    store: psqlStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/files/storage/dummy", (req, res) => {
  res.send({ dummy: "dummy" });
});
app.use(userRouter);
app.use("/profile", isAuthenticated, profileRouter);
app.use("/files", isAuthenticated, fileRouter);

app.get("/test", isAuthenticated, (req, res) => {
  res.send(JSON.stringify("<p>hey!<p>"));
});

app.listen(port, () => {
  console.log("listening on port: " + port);
});
