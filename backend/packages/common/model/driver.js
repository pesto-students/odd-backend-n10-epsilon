import mongoose from "mongoose";
import validator from "validator";
import jwt from "jwt";
import config from "../config";
import { otpGenerator } from "../helper";

const driverSchema = new mongoose.Schema({
  first_name: {
    type: String,
    trim: true,
  },
  last_name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  mobile_number: {
    type: Number,
    unique: true,
    required: true,
    trim: true,
    validate(value) {
      if (value.toString().length !== 10) {
        throw new Error("Invalid mobile number");
      }
    },
  },
  otp_verify: {
    type: Number,
    trim: true,
    default: null,
  },
  address: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  driver_status: {
    type: String,
    default: "pending",
    enum: ["approve", "rejected", "pending"],
  },

  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" },
  },
  tokens: [
    {
      token: {
        type: String,
      },
      device_token: {
        type: String,
      },
    },
  ],
});

driverSchema.virtual("order", {
  ref: "Order",
  localField: "_id",
  foreignField: "driver_id",
});

driverSchema.methods.generateAuthToken = async function () {
  const driver = this;
  const token = jwt.sign(
    { _id: driver._id.toString(), role: "driver" },
    config.JWT_SECRET
  );

  driver.tokens = driver.tokens.concat({ token });
  await driver.save();

  return token;
};

driverSchema.statics.findByCredentials = async (mobileNumber) => {
  const driver = await DriverSchema.findOne({ mobileNumber });
  const otp = otpGenerator();

  if (!driver) {
    const Driver = new DriverSchema({ mobileNumber, otpVerify: otp });
    console.log(Driver);
    let data = await Driver.save();
    return data;
  }

  driver.otpVerify = generateOtp();
  return await driver.save();
};

driverSchema.statics.userOtpVerify = async (id, otp) => {
  const driver = await DriverSchema.findOne({ _id: id, otpVerify: otp });
  if (!driver) {
    throw new Error("Driver not found");
  }
  driver.otpVerify = null;
  return await driver.save();
};

const DriverSchema = mongoose.model("Driver", driverSchema);

export default DriverSchema;
