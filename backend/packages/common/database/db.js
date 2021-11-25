import mongoose from "mongoose";
import { config } from "../config";
const data = config.DB_URL;
// Connecting to the database
const connectDB = () => {
  mongoose
    .connect(data, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to the database" + data);
    })
    .catch((err) => {
      console.log("Could not connect to the database. Exiting now...", err);
      process.exit();
    });
};

export default connectDB;
