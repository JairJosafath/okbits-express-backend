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
const corsOptions = {
  origin: "http://localhost:3000",
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
    secret: "some secret",
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

app.use(userRouter);
app.use("/files", isAuthenticated, fileRouter);

app.get("/test", (req, res) => {
  res.send(JSON.stringify("<p>hey!<p>"));
});

app.listen(port, () => {
  console.log("listening on port: " + port);
});
