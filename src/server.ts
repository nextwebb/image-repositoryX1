import express from "express";
import createError from "http-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import modules from "./modules";

const app = express();
// temporary allow all origins to access this server
app.use(cors());
// console.log(process.env.TEST_DB_ENVIRONMENT);

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  mongoose.Promise = global.Promise;
  mongoose
    .connect("mongodb://localhost:27017/image-repository")
    .then(() => console.log("docker mongodb container conneted!"))
    .catch((err: any) => console.log(err));
} else {
  const dbUri = process.env.DEV_DB_URI;
  // mongoose connection
  mongoose
    .connect(dbUri)
    .then(() => console.log("database connected!"))
    .catch((error) => console.log(error.message));
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// register all routes
app.get("/", (req, res) => {
  res.send("working!");
});

app.use("/api/v1", modules);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(
  (
    err: { message: any; status: any },
    req: { app: { get: (arg0: string) => string } },
    res: {
      locals: { message: any; error: any };
      status: (arg0: any) => void;
      render: (arg0: string) => void;
    },
    next: any
  ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  }
);

app.listen(process.env.PORT, () =>
  console.log(`Running on port ${process.env.PORT}`)
);
