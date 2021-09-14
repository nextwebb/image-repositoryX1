import mongoose from "mongoose";

import app from "./app";
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

app.listen(process.env.PORT, () =>
  console.log(`Running on port ${process.env.PORT}`)
);
